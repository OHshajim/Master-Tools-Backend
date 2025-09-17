import Coupon from "../models/Coupon.js";

// Create coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, planId } = req.body;

        // --- Basic validation ---
        if (!code || !discount || !planId) {
            return res.status(400).json({
                success: false,
                message: "Code, discount, and planId are required",
            });
        }

        if (typeof discount !== "number" || discount < 0 || discount > 100) {
            return res.status(400).json({
                success: false,
                message: "Discount must be a number between 0 and 100",
            });
        }

        // Ensure coupon code is unique
        const existing = await Coupon.findOne({
            code: code.toUpperCase(),
            planId,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists for this plan",
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discount,
            planId,
        });

        res.status(201).json({ success: true, coupon });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all coupons
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().populate(
            "planId",
            "name price"
        );
        res.json({ success: true, coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).populate(
            "planId",
            "name"
        );
        if (!coupon) {
            return res
                .status(404)
                .json({ success: false, message: "Coupon not found" });
        }
        res.json({ success: true, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const { code, discount } = req.body;

        if (discount !== undefined) {
            if (
                typeof discount !== "number" ||
                discount < 0 ||
                discount > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Discount must be a number between 0 and 100",
                });
            }
        }

        if (code) {
            req.body.code = code.toUpperCase();
        }

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!coupon) {
            return res
                .status(404)
                .json({ success: false, message: "Coupon not found" });
        }

        res.json({ success: true, coupon });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res
                .status(404)
                .json({ success: false, message: "Coupon not found" });
        }
        res.json({ success: true, message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Validate coupon (check if active & return discount)
export const validateCoupon = async (req, res) => {
    try {
        const { code, planId } = req.body;

        if (!code || !planId) {
            return res.status(400).json({
                success: false,
                message: "Code and planId are required",
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            planId,
            active: true,
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid or inactive coupon",
            });
        }

        res.json({ success: true, discount: coupon.discount, coupon });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
