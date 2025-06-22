const Order = require('../../models/Order');
const User = require('../../models/User');

// Get dashboard stats: total sales, total orders, total users
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const salesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalSales = salesAgg[0]?.total || 0;
    res.json({ sales: totalSales, orders: totalOrders, users: totalUsers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Get recent orders (with pagination)
const getRecentOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    // No user lookup, just show userId as in Orders page
    const formatted = orders.map(order => ({
      _id: order._id,
      userName: order.userId || 'N/A',
      amount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.orderDate || order.createdAt
    }));
    res.json({
      orders: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
};

module.exports = { getDashboardStats, getRecentOrders };
