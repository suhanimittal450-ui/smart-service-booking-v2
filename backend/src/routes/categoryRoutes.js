const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================
PUBLIC ROUTES
=====================================
*/

router.get("/", getCategories);

router.get("/:id", getCategory);

/*
=====================================
ADMIN ROUTES
=====================================
*/

router.post("/", protect, authorize("admin"), createCategory);

router.put("/:id", protect, authorize("admin"), updateCategory);

router.delete("/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;
