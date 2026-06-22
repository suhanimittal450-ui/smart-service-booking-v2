const express = require("express");

const router = express.Router();

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  myServices,
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middleware/authMiddleware");

/*
=====================================
PUBLIC ROUTES
=====================================
*/

router.get("/", getServices);

router.get("/:id", getService);

/*
=====================================
PROVIDER ROUTES
=====================================
*/

router.post("/", protect, authorize("provider"), createService);

router.get("/provider/my-services", protect, authorize("provider"), myServices);

router.put("/:id", protect, authorize("provider", "admin"), updateService);

router.delete("/:id", protect, authorize("provider", "admin"), deleteService);

module.exports = router;
