const express = require('express');
const { Op, fn, col } = require('sequelize');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get total customers
    const totalCustomers = await Customer.count();

    // Get active customers (assuming active means created in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeCustomers = await Customer.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Get new customers this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newCustomers = await Customer.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // Get monthly revenue
    const revenueSum = await Order.sum('totalAmount', {
      where: {
        createdAt: { [Op.gte]: startOfMonth },
        status: { [Op.ne]: 'cancelled' }
      }
    });

    const revenue = revenueSum || 0;

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
    const sales = await Order.findAll({
      where: {
        status: { [Op.ne]: 'cancelled' }
      },
      attributes: [
        [fn('to_char', col('createdAt'), 'YYYY-MM-DD'), '_id'],
        [fn('SUM', col('totalAmount')), 'totalSales'],
        [fn('COUNT', col('id')), 'orderCount']
      ],
      group: [fn('to_char', col('createdAt'), 'YYYY-MM-DD')],
      order: [[fn('to_char', col('createdAt'), 'YYYY-MM-DD'), 'ASC']],
      raw: true
    });

    const salesData = sales.map(s => ({
      _id: s._id,
      totalSales: parseFloat(s.totalSales || 0),
      orderCount: parseInt(s.orderCount || 0, 10)
    }));

    res.json(salesData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
