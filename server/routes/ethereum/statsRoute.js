const express = require('express');

const statsRoute = express()

const Stats = require("../../models/StatsModel");

statsRoute.post('/', async (req, res) => {

    const { type, timestamp, address } = req.body || {};

    try {
        const stats = await Stats.create({ type, timestamp, address })
        if (!stats) throw Error('Something went wrong saving the stats');
        res.status(200)
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
);

module.exports = statsRoute;