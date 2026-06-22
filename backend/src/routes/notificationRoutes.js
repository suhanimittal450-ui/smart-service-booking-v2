const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", createNotification);

router.get("/", protect, getNotifications);

router.put("/:id/read", protect, markAsRead);

module.exports = router;
