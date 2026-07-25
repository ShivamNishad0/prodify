const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

const router = express.Router();

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'address', 'status'] }
      ],
      order: [['orderDate', 'DESC']]
    });

    // Populate items.product manually since items are JSONB
    const productIds = new Set();
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.product) productIds.add(item.product);
        });
      }
    });

    const productsList = await Product.findAll({
      where: { id: Array.from(productIds) },
      attributes: ['id', 'title', 'price', 'category']
    });

    const productMap = {};
    productsList.forEach(p => {
      productMap[p.id] = p.toJSON();
    });

    const formattedOrders = orders.map(order => {
      const plainOrder = order.toJSON();
      if (plainOrder.items && Array.isArray(plainOrder.items)) {
        plainOrder.items = plainOrder.items.map(item => {
          const prodId = item.product;
          const prodObj = productMap[prodId] || { id: prodId, name: 'Unknown Product', price: item.price };
          // Map 'title' to 'name' for frontend compatibility if populated keys are checked
          return {
            ...item,
            product: {
              ...prodObj,
              name: prodObj.title || prodObj.name
            }
          };
        });
      }
      return plainOrder;
    });

    res.json(formattedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] }
      ]
    });
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const plainOrder = order.toJSON();
    if (plainOrder.items && Array.isArray(plainOrder.items)) {
      plainOrder.items = await Promise.all(
        plainOrder.items.map(async (item) => {
          const prodId = item.product;
          const product = await Product.findByPk(prodId, { attributes: ['id', 'title', 'price'] });
          const prodObj = product ? product.toJSON() : { id: prodId, title: 'Unknown Product', price: item.price };
          return {
            ...item,
            product: {
              ...prodObj,
              name: prodObj.title
            }
          };
        })
      );
    }

    res.json(plainOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { customer, items, totalAmount, shippingAddress } = req.body;
    
    // Verify customer exists
    const customerObj = await Customer.findByPk(customer);
    if (!customerObj) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    const order = await Order.create({
      customerId: customer,
      items,
      totalAmount,
      shippingAddress,
    });
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update order
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer, items, totalAmount, status, shippingAddress } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    await order.update({
      customerId: customer,
      items,
      totalAmount,
      status,
      shippingAddress,
    });

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    await order.destroy();
    res.json({ msg: 'Order deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
