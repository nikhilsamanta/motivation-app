const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");

// Referral code generator
const generateReferralCode = (name) => {
    return name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
};

/* Test Route */
router.get("/test", (req, res) => {
    res.send("Auth route working");
});

/* Register API */
router.post("/register", async (req, res) => {

    const { name, email, password, referredBy } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const referralCode = generateReferralCode(name);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            referralCode,
            referredBy
        });

        await user.save();

        res.json({
            message: "User registered",
            referralCode
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }

});

/* Login API */
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }

});

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Update name
router.put("/update-name", authMiddleware, async (req, res) => {

    const { name } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
        );

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating name" });
    }

});

// Change password
router.put("/change-password", authMiddleware, async (req, res) => {

    const { password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(req.user.id, {
            password: hashedPassword
        });

        res.json({
            message: "Password updated"
        });
    } catch (error) {
        res.status(500).json({ message: "Error changing password" });
    }

});

const { Expo } = require("expo-server-sdk");
const expo = new Expo();

// Test push notification
router.post("/test-push", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.pushToken) {
            return res.status(400).json({ message: "No push token found for user" });
        }

        if (!Expo.isExpoPushToken(user.pushToken)) {
            return res.status(400).json({ message: "Invalid push token" });
        }

        const messages = [{
            to: user.pushToken,
            sound: 'default',
            title: 'Motivation App Test 🚀',
            body: 'Your notifications are working! Get ready for daily inspiration.',
        }];

        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
        }

        res.json({ message: "Test notification sent" });
    } catch (error) {
        res.status(500).json({ message: "Error sending test notification" });
    }
});

// Save push token
router.put("/push-token", authMiddleware, async (req, res) => {
    const { pushToken } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, { pushToken });
        res.json({ message: "Push token saved" });
    } catch (error) {
        res.status(500).json({ message: "Error saving push token" });
    }
});

// Get referral stats
// Get notifications
router.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        
        const unreadCount = await Notification.countDocuments({ 
            userId: req.user.id, 
            isRead: false 
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark notification as read
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true }
        );
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking notification as read" });
    }
});

// Mark all as read
router.put("/notifications/read-all", authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking all as read" });
    }
});

router.get("/referrals", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const referredUsers = await User.find({ referredBy: user.referralCode }).select("name email createdAt");

        res.json({
            referralCode: user.referralCode,
            referralCount: referredUsers.length,
            referredUsers
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching referrals" });
    }
});

module.exports = router;