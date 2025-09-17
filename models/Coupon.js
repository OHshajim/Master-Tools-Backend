import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plans",
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Coupons", CouponSchema);
