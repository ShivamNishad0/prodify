const express = require('express');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

const router = express.Router();

// Get all customers with metrics
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Get order statistics for each customer
    const Order = require('../models/Order');
    
    const customersWithMetrics = await Promise.all(
      customers.map(async (customer) => {
        const customerOrders = await Order.findAll({ where: { customerId: customer.id } });
        
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const orderCount = customerOrders.length;
        const lastOrder = customerOrders.length > 0 
          ? customerOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0]
          : null;
        
        return {
          ...customer.toObject(),
          metrics: {
            totalSpent,
            orderCount,
            lastOrderDate: lastOrder ? lastOrder.orderDate : null
          }
        };
      })
    );
    
    res.json(customersWithMetrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get customer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
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
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    await customer.update({ name, email, phone, address, status });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    await customer.destroy();
    res.json({ msg: 'Customer deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
