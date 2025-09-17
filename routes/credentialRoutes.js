const express = require("express");
const router = express.Router();
const {
    getCredentials,
    createCredential,
    updateCredential,
    deleteCredential,
    getSpecificCredentials,
} = require("../controllers/credentialController");
const { requireAuth, authorize } = require("../middleware/authMiddleware");

router.get("/", getCredentials);
router.get("/specificCredential", getSpecificCredentials);

router.post("/",requireAuth,authorize("admin"),  createCredential);
router.put("/:id", requireAuth, authorize("admin"), updateCredential);
router.delete("/:id", requireAuth, authorize("admin"), deleteCredential);

module.exports = router;
