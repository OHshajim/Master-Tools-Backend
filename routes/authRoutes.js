const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/register", authLimiter, ctrl.register);
router.post("/login", authLimiter, ctrl.login);
router.post("/oauth", ctrl.oauthLogin);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);
router.post("/logout-all", requireAuth, ctrl.logoutAll);
router.get("/me", requireAuth, ctrl.getMe);

router.post("/reset-password", authLimiter, ctrl.resetPassword);
router.post("/forgot-password", authLimiter, ctrl.forgotPassword);
router.post("/change-password", authLimiter, requireAuth, ctrl.changePassword);
router.patch("/change-name", authLimiter, requireAuth, ctrl.changeName);

module.exports = router;
