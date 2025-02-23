const express = require('express');
const Order = require('../models/order');

const router = express.Router();

// 1️ Add a new order
router.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 2️ Find the top 3 best-selling products
router.get('/analytics/top-products', async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $group: { _id: "$productName", totalQuantity: { $sum: "$quantity" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 3 }
    ]);
    if (!topProducts.length) return res.status(404).json({ message: "No data found" });
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3️ Compute total revenue for each category
router.get('/analytics/revenue-by-category', async (req, res) => {
  try {
    const revenueByCategory = await Order.aggregate([
      { $group: { _id: "$category", totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    if (!revenueByCategory.length) return res.status(404).json({ message: "No data found" });
    res.json(revenueByCategory);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4️ Calculate average order value
router.get('/analytics/average-order-value', async (req, res) => {
  try {
    const averageOrderValue = await Order.aggregate([
      { $group: { _id: null, avgOrderValue: { $avg: "$totalPrice" } } }
    ]);
    if (!averageOrderValue.length) return res.status(404).json({ message: "No data found" });
    res.json(averageOrderValue[0]);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5️ Count number of orders per month
router.get('/analytics/orders-per-month', async (req, res) => {
  try {
    const ordersPerMonth = await Order.aggregate([
      { $group: { _id: { $month: "$orderDate" }, totalOrders: { $sum: 1 } } }
    ]);
    if (!ordersPerMonth.length) return res.status(404).json({ message: "No data found" });
    res.json(ordersPerMonth);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 6️ Find the percentage of canceled orders
router.get('/analytics/cancellation-rate', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const canceledOrders = await Order.countDocuments({ status: "Cancelled" });
    const cancellationRate = totalOrders ? (canceledOrders / totalOrders) * 100 : 0;
    res.json({ cancellationRate });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
