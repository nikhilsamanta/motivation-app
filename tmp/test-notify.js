const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Expo } = require('expo-server-sdk');
const User = require('../backend/models/User');
const Quote = require('../backend/models/Quote');

dotenv.config({ path: '../backend/.env' });

const expo = new Expo();

async function testNotify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ pushToken: { $exists: true } });
        if (!user) {
            console.log('No user with push token found. Open the app on a physical device first.');
            process.exit(0);
        }

        const quote = await Quote.findOne();
        if (!quote) {
            console.log('No quotes found.');
            process.exit(0);
        }

        console.log(`Sending test notification to user: ${user.name} (${user.pushToken})`);
        
        const messages = [{
            to: user.pushToken,
            sound: 'default',
            title: 'Test Motivation 🚀',
            body: quote.text,
        }];

        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            let tickets = await expo.sendPushNotificationsAsync(chunk);
            console.log('Ticket:', tickets);
        }

        console.log('Notification sent successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testNotify();
