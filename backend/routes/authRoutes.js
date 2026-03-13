const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");

// Referral code generator
const generateReferralCode = (name) => {
    return name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
};


const authMiddleware = require("../middleware/authMiddleware");

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

// Update name
router.put("/update-name", authMiddleware, async (req, res) => {

    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true }
    );

    res.json(user);

});
// Change password
router.put("/change-password", authMiddleware, async (req, res) => {

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user.id, {
        password: hashedPassword
    });

    res.json({
        message: "Password updated"
    });

});

/* Test Route */
router.get("/test", (req, res) => {
    res.send("Auth route working");
});

/* Register API */
router.post("/register", async (req, res) => {

    const { name, email, password, referredBy } = req.body;

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

});
module.exports = router;

const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

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
        "mysecretkey",
        { expiresIn: "1d" }
    );

    res.json({ token });

    const generateReferralCode = (name) => {
        return name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
    };

});