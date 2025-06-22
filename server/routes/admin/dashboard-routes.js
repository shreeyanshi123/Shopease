const express = require('express');
const { getDashboardStats, getRecentOrders } = require('../../controllers/admin/dashboard-controller');
const router = express.Router();

router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);

module.exports = router;
