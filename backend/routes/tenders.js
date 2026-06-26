const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Tender = require('../models/Tender');

// @route   GET api/tenders
// @desc    Get all tenders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      organization, 
      status, 
      location, 
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (organization) filter.organization = { [Op.iLike]: `%${organization}%` };
    if (status) filter.status = status;
    if (location) filter.location = { [Op.iLike]: `%${location}%` };
    
    // Search functionality
    if (search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tenderId: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build sort options
    const sortOrderOption = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const tenders = await Tender.findAll({
      where: filter,
      attributes: { exclude: ['termsConditions', 'eligibility'] },
      order: [[sortBy, sortOrderOption]],
      offset,
      limit: parseInt(limit)
    });

    const total = await Tender.count({ where: filter });

    res.json({
      tenders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tenders/:id
// @desc    Get single tender by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    res.json(tender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tenders/search/:query
// @desc    Search tenders
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const tenders = await Tender.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { organization: { [Op.iLike]: `%${query}%` } },
          { tenderId: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'title', 'organization', 'tenderId', 'category', 'estimatedValue', 'applicationDeadline', 'status', 'location'],
      limit: 20
    });

    res.json(tenders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tenders/categories
// @desc    Get all unique categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const list = await Tender.findAll({
      attributes: ['category'],
      group: ['category']
    });
    const categories = list.map(t => t.category).filter(Boolean);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tenders
// @desc    Create a new tender (Admin only)
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const tender = await Tender.create(req.body);
    res.json(tender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tenders/:id
// @desc    Update a tender (Admin only)
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);

    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    await tender.update(req.body);
    res.json(tender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tenders/:id
// @desc    Delete a tender (Admin only)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);

    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    await tender.destroy();
    res.json({ msg: 'Tender removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
