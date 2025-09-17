const express = require("express");
const router = express.Router();
const { getPlans, deletePlan, deletePlanAll} = require("../controllers/ArchivePlansController");

// for admin
router.get("/", getPlans);
router.delete("/:id", deletePlan);
router.delete("/", deletePlanAll);

module.exports = router;
