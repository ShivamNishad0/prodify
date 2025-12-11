const express = require('express');
const auth = require('../middleware/auth');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Get all inventory items
router.get('/', auth, async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product', 'name');
    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get inventory item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('product', 'name');
    if (!item) {
      return res.status(404).json({ msg: 'Inventory item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create inventory item
router.post('/', auth, async (req, res) => {
  try {
    const { product, quantity, location } = req.body;
    const item = new Inventory({
      product,
      quantity,
      location,
    });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update inventory item
router.put('/:id', auth, async (req, res) => {
  try {
    const { product, quantity, location } = req.body;
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { product, quantity, location, updatedAt: Date.now() },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ msg: 'Inventory item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete inventory item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Inventory item not found' });
    }
    res.json({ msg: 'Inventory item deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
