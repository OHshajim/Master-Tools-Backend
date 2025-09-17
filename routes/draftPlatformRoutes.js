const express = require("express");
const router = express.Router();

const { requireAuth, authorize } = require("../middleware/authMiddleware");
const { createDraft,deleteDraft,getDrafts, toggleDraftPlatform } = require("../controllers/DraftPlatformController");

router.get("/", getDrafts);     
router.post("/", requireAuth ,authorize("admin"), createDraft); 
router.delete("/:id", requireAuth, authorize("admin"), deleteDraft);
router.patch("/toggle",requireAuth ,authorize("admin"), toggleDraftPlatform);

module.exports = router;
