const express = require("express");
const Events = require("../../../models/calendars/EventsModel");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");
const eventsRoute = express();

const { lruCache } = require("../../../services/cache/lru");

eventsRoute.get("/", async (req, res) => {
    const ttl = 6 * 60 * 60 * 1000;

    try {
        const events = await Events.find({});
        if (!events) throw new Error("Events not found");

        await lruCache(Events.find({}), {
            key: `events`,
            ttl,
        });

        res.status(200).json({events});
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" });
    }

})

eventsRoute.post('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { timestamp, eventName, links, eventDescription, eventLocation } = req.body || {};

    try {
        if (isAdmin) {
            const events = await Events.create({ timestamp, eventName, links, eventDescription, eventLocation })
            if (!events) throw Error('Something went wrong saving the admin IRL event');
            return res.status(200).json({events});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

eventsRoute.delete('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { id } = req.body || {};

    try {
        if (isAdmin) {
            const events = await Events.deleteOne({_id: id});
            if (!events) throw Error('Something went wrong deleting all the admin IRL events');
            return res.status(200).json({events});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = eventsRoute