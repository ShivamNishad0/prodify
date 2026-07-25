const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const sortOrderOption = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const products = await Product.findAll({
      where,
      order: [[sortBy, sortOrderOption]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [{ model: User, as: 'creatorUser', attributes: ['id', 'name', 'email'] }]
    });

    const total = await Product.count({ where });

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalProducts: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get product by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: User, as: 'creatorUser', attributes: ['id', 'name', 'email'] }]
    });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create product
router.post('/', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      quantity,
      category,
      subcategory,
      sku,
      barcode,
      brand,
      color,
      size,
      material,
      weightValue,
      weightUnit,
      length,
      width,
      height,
      dimensionUnit,
      status,
      tags,
      vendorName,
      vendorEmail,
      vendorPhone,
      specifications
    } = req.body;

    // Check for duplicate SKU
    if (sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({ msg: 'Product with this SKU already exists' });
      }
    }

    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
      quantity: parseInt(quantity),
      category,
      subcategory: subcategory || '',
      sku: sku || '',
      barcode: barcode || '',
      brand: brand || '',
      color: color || '',
      size: size || '',
      material: material || '',
      weight: {
        value: weightValue ? parseFloat(weightValue) : 0,
        unit: weightUnit || 'kg'
      },
      dimensions: {
        length: length ? parseFloat(length) : 0,
        width: width ? parseFloat(width) : 0,
        height: height ? parseFloat(height) : 0,
        unit: dimensionUnit || 'cm'
      },
      status: status || 'active',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      vendor: {
        name: vendorName || '',
        email: vendorEmail || '',
        phone: vendorPhone || ''
      },
      specifications: specifications ? JSON.parse(specifications) : [],
      createdBy: req.user.id
    });

    // Add photo if uploaded
    if (req.file) {
      product.photo = `/uploads/products/${req.file.filename}`;
    }

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
});

// Update product
router.put('/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      quantity,
      category,
      subcategory,
      sku,
      barcode,
      brand,
      color,
      size,
      material,
      weightValue,
      weightUnit,
      length,
      width,
      height,
      dimensionUnit,
      status,
      tags,
      vendorName,
      vendorEmail,
      vendorPhone,
      specifications,
      existingPhoto
    } = req.body;

    // Check for duplicate SKU (excluding current product)
    if (sku) {
      const existingProduct = await Product.findOne({
        where: {
          sku,
          id: { [Op.ne]: req.params.id }
        }
      });
      if (existingProduct) {
        return res.status(400).json({ msg: 'Product with this SKU already exists' });
      }
    }

    const updateData = {
      title,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
      quantity: parseInt(quantity),
      category,
      subcategory: subcategory || '',
      sku: sku || '',
      barcode: barcode || '',
      brand: brand || '',
      color: color || '',
      size: size || '',
      material: material || '',
      weight: {
        value: weightValue ? parseFloat(weightValue) : 0,
        unit: weightUnit || 'kg'
      },
      dimensions: {
        length: length ? parseFloat(length) : 0,
        width: width ? parseFloat(width) : 0,
        height: height ? parseFloat(height) : 0,
        unit: dimensionUnit || 'cm'
      },
      status: status || 'active',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      vendor: {
        name: vendorName || '',
        email: vendorEmail || '',
        phone: vendorPhone || ''
      },
      specifications: specifications ? JSON.parse(specifications) : [],
      updatedAt: Date.now()
    };

    // Handle photo update
    if (req.file) {
      updateData.photo = `/uploads/products/${req.file.filename}`;
    } else if (existingPhoto !== undefined) {
      updateData.photo = existingPhoto;
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await product.update(updateData);

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
});

// Delete product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
 
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
 
    // Delete associated photo file
    if (product.photo) {
      const photoPath = path.join(__dirname, '..', product.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
 
    await product.destroy();
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get product categories
router.get('/meta/categories', auth, async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });
    const categories = products.map(p => p.category).filter(Boolean);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get low stock products
router.get('/meta/low-stock', auth, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        quantity: { [Op.lte]: 10 }
      },
      order: [['quantity', 'ASC']]
    });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Bulk update stock
router.post('/bulk/stock', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, quantity }

    await Promise.all(
      updates.map(update =>
        Product.update(
          { quantity: update.quantity },
          { where: { id: update.id } }
        )
      )
    );
    res.json({ msg: 'Stock updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

