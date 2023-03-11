const express = require("express");
const Events = require("../../../models/calendars/EventsModel");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");
const eventsRoute = express();

const { lruCache } = require("../../../services/cache/lru");

const ttl = 6 * 60 * 60 * 1000;

const manageEvents = async (Collection, type, set) => {
    const res = await lruCache(Collection.find({}), {
        key: type,
        ttl,
    }, set);
    return res;
};

eventsRoute.get("/", checkAuth, async (req, res) => {
    
    try {
        const events = await manageEvents(Events, 'events');
        if (!events) throw new Error("Events not found");

        res.status(200).json({events});
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" });
    }

})

eventsRoute.post('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { timestamp, eventName, links, eventDescription, eventLocation, more } = req.body || {};
    const event = { timestamp, eventName, links, eventDescription, eventLocation };
    try {
        if (isAdmin) {
            const nextEvents = [event];
            const oneDayInMilliseconds = 86400000;
            if (more && parseInt(more) > 0) {
                Array.from(Array(parseInt(more))).forEach((_, index) => {
                    const nextTimestamp = timestamp + ((index + 1) * oneDayInMilliseconds);
                    nextEvents.push({...event, timestamp: nextTimestamp});
                });
                const events = await Events.create(nextEvents);
                if (!events) throw Error('Something went wrong saving multiple admin IRL events');
                await manageEvents(Events, 'events', true);
                return res.status(200).json({events});
            } 
            const events = await Events.create(event)
            if (!events) throw Error('Something went wrong saving the admin IRL event');
            await manageEvents(Events, 'events', true);
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
            await manageEvents(Events, 'events', true);
            return res.status(200).json({events});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = eventsRoute