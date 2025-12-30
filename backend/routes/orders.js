const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone address status')
      .populate('items.product', 'name price category')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { customer, items, totalAmount, shippingAddress } = req.body;
    const order = new Order({
      customer,
      items,
      totalAmount,
      shippingAddress,
    });
    await order.save();
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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { customer, items, totalAmount, status, shippingAddress, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.json({ msg: 'Order deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
