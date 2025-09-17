const express = require("express");
const router = express.Router();
const {
    getQuickLinks,
    createQuickLink,
    updateQuickLink,
    deleteQuickLink,
    reorderQuickLink,
} = require("../controllers/quickLinksController");

router.get("/", getQuickLinks);
router.post("/", createQuickLink);
router.put("/:id", updateQuickLink);
router.delete("/:id", deleteQuickLink);
router.patch("/:id/reorder", reorderQuickLink);

module.exports = router;
