const express = require("express");
const Drops = require("../../../models/calendars/DropsModel");
const checkAdmin = require("../../../middleware/checkAdmin");
const checkAuth = require("../../../middleware/checkAuth");

const dropsRoute = express();

const { lruCache } = require("../../../services/cache/lru");

dropsRoute.get("/", checkAuth, async (req, res) => {
    const ttl = 6 * 60 * 60 * 1000;
    
    try {
        const drops = await Drops.find({});
        if (!drops) throw new Error("Drops not found");

        await lruCache(Drops.find({}), {
            key: `drops`,
            ttl,
        });

        res.status(200).json({drops});
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" });
    }

})

dropsRoute.post('/', checkAuth, checkAdmin, async (req, res) => {
    const { address } = req.userDetails;
    const isAdmin = req.isAdmin;
    const { collectionName, links, price, supply, timestamp, eventDescription } = req.body || {};

    try {
        if (isAdmin) {
            const drops = await Drops.create({ collectionName, links, price, supply, timestamp, eventDescription })
            if (!drops) throw Error('Something went wrong saving the admin drops event');
            return res.status(200).json({drops});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

dropsRoute.delete('/', checkAuth, checkAdmin, async (req, res) => {
    const isAdmin = req.isAdmin;
    const { id } = req.body || {};

    try {
        if (isAdmin) {
            const drops = await Drops.deleteOne({_id: id});
            if (!drops) throw Error('Something went wrong deleting all the admin drops event');
            return res.status(200).json({drops});
        } else {
            throw Error('You are not authorized');
        }
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = dropsRoute