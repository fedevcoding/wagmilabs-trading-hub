const express = require("express")
const Drops = require("../../../models/calendars/DropsModel")

const dropsRoute = express()

dropsRoute.get("/", async (req, res) => {

    try {

        const drops = await Drops.find({});;

        if (!drops) throw new Error("Drops not found")

        res.status(200).json({drops})
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})

dropsRoute.post('/', async (req, res) => {

    const { collectionName, links, price, supply, timestamp, address } = req.body || {};

    try {
        const drops = await Drops.create({ collectionName, links, price, supply, timestamp, address })
        if (!drops) throw Error('Something went wrong saving the admin drops event');
        return res.status(200).json({drops});
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = dropsRoute