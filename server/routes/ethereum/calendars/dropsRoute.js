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


module.exports = dropsRoute