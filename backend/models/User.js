const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    referralCode: {
        type: String,
        unique: true
    },

    referredBy: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);