const mongoose = require("mongoose")

const PersonalSchema = mongoose.Schema({
    timestamp: {
        type: Number
    },
    eventName: {
        type: String
    },
    links: {
        type: Object
    },
    eventDecription: {
        type: String
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Personal", PersonalSchema)