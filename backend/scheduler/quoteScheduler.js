const cron = require("node-cron");
const Quote = require("../models/Quote");

cron.schedule("* * * * *", async () => {


    console.log("Running daily quote job");

    try {

        const quotes = await Quote.find();

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        console.log("Today's quote:", randomQuote.text);

    } catch (error) {

        console.log(error);

    }

});