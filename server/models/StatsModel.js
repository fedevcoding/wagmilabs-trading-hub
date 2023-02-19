const mongoose = require("mongoose")

const StatsSchema = mongoose.Schema({
    address: {
        type: String,
    },
    type: {
        type: String,
    },
    timestamp: {
        type: Number,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Stats", StatsSchema)

