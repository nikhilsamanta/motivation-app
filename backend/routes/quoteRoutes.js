
const express = require("express");
const router = express.Router();

const Quote = require("../models/Quote");
const authMiddleware = require("../middleware/authMiddleware");

// Add quote
router.post("/add", async (req, res) => {

    const { text, author } = req.body;

    try {

        const quote = new Quote({
            text,
            author
        });

        await quote.save();

        res.json({
            message: "Quote added successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error adding quote"
        });

    }

});

// Get all quotes
router.get("/all", authMiddleware, async (req, res) => {
    try {
        console.log(`GET /api/quotes/all request from user: ${req.user.id || req.user._id || 'unknown'}`);
        const quotes = await Quote.find();
        console.log(`Found ${quotes.length} quotes to send`);
        res.json(quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({
            message: "Error fetching quotes"
        });
    }
});

module.exports = router;