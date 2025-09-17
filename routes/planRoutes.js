const express = require("express");
const router = express.Router();
const {
    getPlanBySlug,
    createPlan,
    getPlans,
    getPlanById,
    toggleHomepage,
    updatePlan,
    deletePlan,
} = require("../controllers/plansController.js");
const { requireAuth } = require("../middleware/authMiddleware.js");

router.get("/:slug", getPlanBySlug);

// for admin
router.get("/", getPlans);
router.get("/:id", getPlanById);
router.post("/", requireAuth, createPlan);
router.patch("/:id",requireAuth, toggleHomepage);
router.put("/:id", requireAuth, updatePlan);
router.delete("/:id",requireAuth, deletePlan);

module.exports = router;
