const express = require("express")
const Personal = require("../../../models/calendars/PersonalModel");

const personalRoute = express()

personalRoute.get("/", async (req, res) => {

    try {

        const personal = await Personal.find({});;

        if (!personal) throw new Error("Personal not found")

        res.status(200).json({personal})
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})

personalRoute.post('/', async (req, res) => {

    const { timestamp, address, eventName, links, eventDescription } = req.body || {};

    try {
        const personal = await Personal.create({ timestamp,address,eventName,links,eventDescription })
        if (!personal) throw Error('Something went wrong saving the admin personal event');
        res.status(200)
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


module.exports = personalRoute