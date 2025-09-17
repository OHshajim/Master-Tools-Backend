const express = require("express");
const {
    createCookie,
    getCookies,
    updateCookie,
    deleteCookie,
    togglePin,
    getUserCookies,
    updateCookieForEx,
} = require("../controllers/cookieController");
const { authorize, requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCookies); // Get all cookies (filter by userId/planId)
router.get("/user",requireAuth, getUserCookies);

router.post("/",requireAuth,authorize("admin"), createCookie); // Add cookie
router.put("/:id",requireAuth, authorize("admin"), updateCookie); // Update cookie
router.put("/cookies/platform/:name", updateCookieForEx); // Update cookie by extension
router.delete("/:id",requireAuth,authorize("admin"), deleteCookie); // Delete cookie
router.patch("/:id/pin",requireAuth,authorize("admin"), togglePin); // Pin/unpin

module.exports = router;
