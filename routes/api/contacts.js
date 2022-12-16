const express = require("express");
const router = express.Router();

const { controllers } = require("../../controllers");

// =====================  GET ALL  =====================
router.get("/", controllers.getAllContacts);

// =====================  GET BY ID  =====================
router.get("/:contactId", controllers.getById);

// =====================  ADD CONTACT  ==================
router.post("/", controllers.addContact);

// =====================  UPDATE CONTACT BY ID ==================
router.put("/:contactId", controllers.updateById);

// =====================  UPDATE CONTACT BY CATEGORY FAVORITE ==================
router.patch("/:contactId/favorite", controllers.updateStatusContact);

// =====================  DELETE CONTACT BY ID ==================
router.delete("/:contactId", controllers.deleteContact);

module.exports = router;
