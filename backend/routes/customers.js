const express = require('express');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get customer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address, status } = req.body;
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      status,
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, address, status } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, status, updatedAt: Date.now() },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json({ msg: 'Customer deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
