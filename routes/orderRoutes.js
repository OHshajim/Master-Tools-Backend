const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getUserOrders,
 } = require("../controllers/orderController.js");
const { requireAuth } = require("../middleware/authMiddleware.js");

router.get("/user/:userId", getUserOrders); // Get orders for a user
router.get("/", getOrders); // Get all orders
router.get("/:id", getOrderById); // Get order by ID

router.post("/",requireAuth, createOrder); // Create order
router.put("/:id",requireAuth, updateOrder); // Update order
router.delete("/:id",requireAuth, deleteOrder); // Delete order

module.exports = router;
