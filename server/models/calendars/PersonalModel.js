const mongoose = require("mongoose")

const PersonalSchema = mongoose.Schema({
    address: {
        type: String,
        unique: True
    },
    events: [
        {
            timestamp: {
                type: Number
            },
            eventName: {
                type: String
            },
            links: {
                type: Object
            },
            eventDescription: {
                type: String
            },
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("Personal", PersonalSchema)