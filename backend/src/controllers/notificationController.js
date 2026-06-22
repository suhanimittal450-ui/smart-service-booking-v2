const Notification = require("../models/Notification");

/*
=====================================
CREATE NOTIFICATION
=====================================
*/

exports.createNotification = async (req, res) => {
  console.log("BODY =>", req.body);

  try {
    const { userId, title, message } = req.body;

    // rest code
    const notification = await Notification.create({
      recipient: userId,
      title,
      message,
    });

    // Real-time notification
    if (global.io) {
      global.io.to(userId.toString()).emit("newNotification", {
        title,
        message,
      });
    }

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET NOTIFICATIONS
=====================================
*/

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
MARK AS READ
=====================================
*/

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
