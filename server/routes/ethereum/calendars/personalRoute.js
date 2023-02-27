const express = require("express")
const Personal = require("../../../models/calendars/PersonalModel");

const personalRoute = express()

personalRoute.get("/", async (req, res) => {

    try {

        const personal = await Personal.find({});;

        if (!personal) throw new Error("Personal not found")

        return res.status(200).json({personal})
    }
    catch (e) {
        return res.status(400).json({ msg: e.message });
    }

})

personalRoute.post('/', async (req, res) => {

    const { timestamp, address, eventName, links, eventDescription } = req.body || {};

    try {
        const personal = await Personal.create({ timestamp,address,eventName,links,eventDescription })
        if (!personal) throw Error('Something went wrong saving the admin personal event');
        
        return res.status(200).json({personal});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

personalRoute.delete('/', async (req, res) => {

    const { id } = req.body || {};

    try {
        const personal = await Personal.deleteOne({_id: id});
        if (!personal) throw Error('Something went wrong deleting all the admin personal events');
        return res.status(200).json({personal});
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});


module.exports = personalRoute