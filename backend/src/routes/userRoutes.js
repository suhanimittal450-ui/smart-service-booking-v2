const express = require("express");

const router = express.Router();

const {
  customerDashboard,
  providerDashboard,
  adminDashboard,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/customer", protect, authorize("customer"), customerDashboard);

router.get("/provider", protect, authorize("provider"), providerDashboard);

router.get("/admin", protect, authorize("admin"), adminDashboard);

/*
=====================================
ADMIN: USER MANAGEMENT
(only admin can view/manage every account)
=====================================
*/

router.get("/admin/users", protect, authorize("admin"), getAllUsers);

router.delete("/admin/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
