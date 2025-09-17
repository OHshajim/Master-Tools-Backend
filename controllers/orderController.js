import Order from "../models/Orders.js";

import Plan from "../models/Plans.js";
import { addDays, addMonths, addYears } from "date-fns";

export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            userName,
            planId,
            planName,
            originalPrice,
            finalPrice,
            couponCode,
            couponDiscount,
            lastFourDigits,
        } = req.body;

        // 1️⃣ Get plan details
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });
        }

        // 2️⃣ Set purchase date
        const purchaseDate = new Date();

        // 3️⃣ Calculate expiration date from plan duration
        let expirationDate = purchaseDate;
        switch (plan.durationType) {
            case "weeks":
                expirationDate = addDays(
                    purchaseDate,
                    (plan.durationValue || 0) * 7
                );
                break;
            case "months":
                expirationDate = addMonths(
                    purchaseDate,
                    plan.durationValue || 0
                );
                break;
            case "years":
                expirationDate = addYears(
                    purchaseDate,
                    plan.durationValue || 0
                );
                break;
            default:
                expirationDate = addDays(purchaseDate, 30); // fallback 30 days
        }

        const orderData = {
            userId,
            userName,
            planId,
            planName: planName || plan.name,
            expirationDate,
            originalPrice,
            finalPrice,
            paymentLastFour: lastFourDigits,
            couponCode,
            couponDiscount: couponDiscount || 0,
            status: "pending",
            date: purchaseDate,
        };
        const order = await Order.create(orderData);
        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


// Get all orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("couponCode", "code discount");
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("couponCode", "code discount");
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update order (e.g., status)
export const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res
                .status(400)
                .json({ success: false, message: "Status is required" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all orders for a specific user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId })
            .populate("couponCode", "code discount");
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
