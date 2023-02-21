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


module.exports = eventsRoute