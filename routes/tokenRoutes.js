const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");

router.post("/", tokenController.createToken);
router.get("/", tokenController.getTokens);
router.patch("/:id/status", tokenController.updateTokenStatus);
router.delete("/:id", tokenController.deleteToken);
router.patch("/:id/lastUsed", tokenController.updateLastUsed);
router.get("/plan/:planId", tokenController.getTokensForPlan);

module.exports = router;
