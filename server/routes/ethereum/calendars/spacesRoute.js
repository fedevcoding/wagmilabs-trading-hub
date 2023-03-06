const express = require("express")
const Spaces = require("../../../models/calendars/SpacesModel")

const spacesRoute = express()

spacesRoute.get("/", async (req, res) => {

    try {

        const spaces = await Spaces.find({});;

        if (!spaces) throw new Error("Spaces not found")

        res.status(200).json({spaces})
    }
    catch (e) {
        res.status(400).json({ error: e, status: "error" })
    }

})

spacesRoute.post('/', async (req, res) => {

    const { timestamp,spaceName,links,spaceDescription,spaceHost } = req.body || {};

    try {
        const spaces = await Spaces.create({ timestamp,spaceName,links,spaceDescription,spaceHost })
        if (!spaces) throw Error('Something went wrong saving the admin spaces event');
        return res.status(200).json({spaces});
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

spacesRoute.delete('/', async (req, res) => {

    const { id } = req.body || {};

    try {
        const spaces = await Spaces.deleteOne({_id: id});
        if (!spaces) throw Error('Something went wrong deleting all the admin spaces event');
        return res.status(200).json({spaces});
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
});

module.exports = spacesRoute