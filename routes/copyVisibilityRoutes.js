const express = require("express");
const {
    getVisibilityState,
    updateGlobalVisibility,
    updatePlanVisibility,
    updatePlatformVisibility,
} = require("../controllers/copyVisibilityController");

const router = express.Router();

router.get("/", getVisibilityState);
router.put("/global", updateGlobalVisibility);
router.put("/plan/:planId", updatePlanVisibility);
router.put("/platform/:platformId", updatePlatformVisibility);

module.exports = router;
