const express = require('express');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get total customers
    const totalCustomers = await Customer.countDocuments();

    // Get active customers (assuming active means created in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeCustomers = await Customer.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get new customers this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Get monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const revenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

    res.json({
      totalCustomers,
      activeCustomers,
      newCustomers,
      monthlyRevenue: revenue
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get sales analytics
router.get('/sales', auth, async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json(salesData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
