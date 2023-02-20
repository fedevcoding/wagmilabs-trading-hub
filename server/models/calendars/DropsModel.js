const mongoose = require("mongoose")

const DropsSchema = mongoose.Schema({
    timestamp: {
        type: Number
    },
    collectionName: {
        type: String
    },
    links: {
        type: Object
    },
    price: {
        type: Number
    },
    supply: {
        type: Number
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Drops", DropsSchema)