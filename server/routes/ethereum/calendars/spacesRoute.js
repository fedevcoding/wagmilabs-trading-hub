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


module.exports = spacesRoute