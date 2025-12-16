const express = require('express');
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
    if (organization) filter.organization = { $regex: organization, $options: 'i' };
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tenderId: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const tenders = await Tender.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-termsConditions -eligibility');

    const total = await Tender.countDocuments(filter);

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
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    res.json(tender);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tender not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tenders/search/:query
// @desc    Search tenders
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const tenders = await Tender.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { organization: { $regex: query, $options: 'i' } },
        { tenderId: { $regex: query, $options: 'i' } }
      ]
    })
    .select('title organization tenderId category estimatedValue applicationDeadline status location')
    .limit(20);

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
    const categories = await Tender.distinct('category');
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
    const newTender = new Tender(req.body);
    const tender = await newTender.save();
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
    let tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    tender = await Tender.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

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
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ msg: 'Tender not found' });
    }

    await Tender.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Tender removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
