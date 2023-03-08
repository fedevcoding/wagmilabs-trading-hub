const express = require("express");
const Spaces = require("../../../models/calendars/SpacesModel");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");

const spacesRoute = express();

const { lruCache } = require("../../../services/cache/lru");

spacesRoute.get("/", checkAuth, async (req, res) => {
    const ttl = 6 * 60 * 60 * 1000;

    try {
        const spaces = await Spaces.find({});
        if (!spaces) throw new Error("Spaces not found");

        await lruCache(Spaces.find({}), {
            key: `spaces`,
            ttl,
        });

        res.status(200).json({spaces});
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" });
    }

})

spacesRoute.post('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { timestamp, spaceName, links, spaceDescription, spaceHost, more } = req.body || {};
    const event = { timestamp,spaceName,links,spaceDescription,spaceHost };

    try {
        if (isAdmin) {
            const nextEvents = [event];
            const oneDayInMilliseconds = 86400000;
            if (more && parseInt(more) > 0) {
                Array.from(Array(parseInt(more))).forEach((_, index) => {
                    const nextTimestamp = timestamp + ((index + 1) * oneDayInMilliseconds);
                    nextEvents.push({...event, timestamp: nextTimestamp});
                });
                const spaces = await Spaces.create(nextEvents);
                if (!spaces) throw Error('Something went wrong saving multiple admin spaces events');
                return res.status(200).json({spaces});
            } 
            const spaces = await Spaces.create(event);
            if (!spaces) throw Error('Something went wrong saving the admin spaces event');
            return res.status(200).json({spaces});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

spacesRoute.delete('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { id } = req.body || {};

    try {
        if (isAdmin) {
            const spaces = await Spaces.deleteOne({_id: id});
            if (!spaces) throw Error('Something went wrong deleting all the admin spaces event');
            return res.status(200).json({spaces});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

module.exports = spacesRoute