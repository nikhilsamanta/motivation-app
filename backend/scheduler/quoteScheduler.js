const cron = require("node-cron");
const Quote = require("../models/Quote");
const User = require("../models/User");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

// Runs daily at 8 AM
cron.schedule("0 8 * * *", async () => {
    console.log("Running daily motivation scheduler...");
    try {
        const count = await Quote.countDocuments();
        if (count === 0) return;

        const random = Math.floor(Math.random() * count);
        const quote = await Quote.findOne().skip(random);

        if (!quote) return;

        // Get all users with a push token
        const users = await User.find({ pushToken: { $exists: true, $ne: null } });
        
        let messages = [];
        for (let user of users) {
            if (!Expo.isExpoPushToken(user.pushToken)) {
                console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: user.pushToken,
                sound: 'default',
                title: 'Daily Inspiration 🌟',
                body: quote.text,
                data: { quoteId: quote._id },
            });
        }

        // Batch notifications
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error("Error sending notification chunk:", error);
            }
        }

        console.log(`Sent notifications to ${messages.length} users: "${quote.text}"`);
    } catch (error) {
        console.error("Scheduler Error:", error);
    }
});