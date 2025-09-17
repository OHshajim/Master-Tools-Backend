import ArchivePlans from "../models/ArchivePlans.js";
import Orders from "../models/Orders.js";
import Plan from "../models/Plans.js";


// Get plans for public user view (exclude drafts)
export const getPlansForUser = async (req, res) => {
    try {
        const query= {};

        // Convert query params to proper types
        for (const [key, value] of Object.entries(req.query)) {
            if (value === "true") query[key] = true;
            else if (value === "false") query[key] = false;
            else query[key] = value;
        }

        const plans = await Plan.find(query).sort({ homepageOrder: 1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPlanBySlug = async (req, res) => {
    try {
        const plan = await Plan.findOne({
            slug: req.params.slug,
            isDraft: false,
        });
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin-specific: Get all plans including drafts

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { name, slug, description, price, durationValue, durationType, homepageOrder,PlanBenefits} = req.body;

    // Basic checks
    if (!name || !slug || !description || !price || !durationValue || !durationType || !PlanBenefits) {
      return res.status(400).json({ message: "Missing required fields" , success:false});
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number",success:false });
    }

    if (!["days", "months", "years"].includes(durationType)) {
      return res.status(400).json({ message: "Invalid durationType" });
    }

    if (homepageOrder && typeof homepageOrder !== "number") {
      return res.status(400).json({ message: "homepageOrder must be a number",success:false });
    }

    // Create and save
    const plan = new Plan(req.body);

    await plan.save();
    res.status(201).json({
        plan: plan,
        message: "Plan created successfully",
        success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all plans
export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ homepageOrder: 1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single plan by ID
export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a plan
export const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Toggle plan's showOnHomepage status
export const toggleHomepage = async (req, res) => {
    try {
        const { id } = req.params; // plan id
        const plan = await Plan.findById(id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        
        // Toggle the boolean value
        plan.showOnHomepage = !plan.showOnHomepage;
        await plan.save();
        
        res.json({
            message: `Plan isHomepage set to ${plan.showOnHomepage}`,
            plan,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const deletePlan = async (req, res) => {
    try {
        const planId = req.params.id;

        // 1. Find the plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // 2. Check for active subscriptions
        const activeSubscriptions = await Orders.find({
            planId,
            expirationDate: { $gte: new Date() },
            status: "approved",
        });

        if (activeSubscriptions.length > 0) {
            return res.status(400).json({
                message:
                    "Cannot delete this plan. Active subscriptions still exist.",
            });
        }

        // 3. Archive before deleting

        await ArchivePlans.create({
            planDetails: {
                planId: plan._id,
                name: plan.name,
                price: plan.price,
                description: plan.description,
                durationValue: plan.durationValue,
                durationType: plan.durationType,
                stickerText: plan.stickerText,
                showOnHomepage: plan.showOnHomepage,
                isDraft: plan.isDraft,
            },
            deletedBy: req.user.id,
        });

        // 4. Delete original plan
        await Plan.findByIdAndDelete(planId);

        res.json({ message: "Plan deleted successfully and archived" });
    } catch (error) {
        console.error("❌ Error deleting plan:", error);
        res.status(500).json({ message: error.message });
    }
};