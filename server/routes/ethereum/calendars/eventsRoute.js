const express = require("express")
const Events = require("../../../models/calendars/EventsModel")

const eventsRoute = express()

eventsRoute.get("/", async (req, res) => {

    try {

        const events = await Events.find({});;

        if (!events) throw new Error("Events not found")

        res.status(200).json({events})
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})

eventsRoute.post('/', async (req, res) => {

    const { timestamp, eventName, links, eventDescription, eventLocation } = req.body || {};

    try {
        const events = await Events.create({ timestamp, eventName, links, eventDescription, eventLocation })
        if (!events) throw Error('Something went wrong saving the admin IRL event');
        res.status(200)
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


module.exports = eventsRoute