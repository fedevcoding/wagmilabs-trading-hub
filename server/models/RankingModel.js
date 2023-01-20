const mongoose = require("mongoose")

const RankingSchema = mongoose.Schema({
    contractAddress: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    floor_price: {
        type: String
    },
    volume: {
        type: Number,
    },
    volumeStats: {
        type: Object
    },
    floorStats: {
        type: Object
    },
    totalSupply: {
        type: Number
    },
    creationDate: {
        type: String
    },
    pendingTxs: [String],
    sales: [
        {
            value: {
                type: Number,
                required: true
            },
            saleTime: {
                type: Number,
                required: true
            }
        }
    ],
}, {
    timestamps: true
})

module.exports = mongoose.model("Ranking", RankingSchema)


RankingSchema.index({ 'sales.saleTime': -1 }, { name: "saleTime_index", background: true, unique: false }, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Index created successfully");
    }
});