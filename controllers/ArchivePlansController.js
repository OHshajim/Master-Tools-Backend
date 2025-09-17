import ArchivePlans from "../models/ArchivePlans.js";

import Orders from "../models/Orders.js";

export const getPlans = async (req, res) => {
    try {
        // Step 1: Get archived plans
        const plans = await ArchivePlans.find().sort({ createdAt: -1 });

        // Step 2: For each plan, get related orders
        const plansWithOrders = await Promise.all(
            plans.map(async (plan) => {
                const orders = await Orders.find({ planId: plan.planId })
                    .select("userName status finalPrice date");

                return {
                    ...plan.toObject(),
                    relatedOrders: orders,
                };
            })
        );

        res.json(plansWithOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ Delete archived plan
export const deletePlan = async (req, res) => {
    try {
        const planId = req.params.id;

        const plan = await ArchivePlans.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        await ArchivePlans.findByIdAndDelete(planId);

        res.json({ message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePlanAll = async (req, res) => {
    try {
        await ArchivePlans.deleteMany({});
        res.json({
            message: "All archived plans deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
