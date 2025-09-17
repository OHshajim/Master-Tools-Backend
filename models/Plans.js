import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    platforms: {
      type: [String],
      default: [],
    },
    PlanBenefits: {
      type: [String],
      default: [],
    },
    durationValue: {
      type: Number,
      required: true,
    },
    durationType: {
      type: String,
      enum: ["days", "months", "years"],
      required: true,
    },
    stickerText: {
      type: String,
      default: null,
    },
    stickerColor: {
      type: String,
      default: null,
    },
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
    homepageOrder: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plans", PlanSchema);
