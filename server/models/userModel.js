const mongoose = require("mongoose")


const cartSchema = new mongoose.Schema({
    //name, tokenId, contractAddress, image, price, marketplace
    name: {
        type: String,
        // required: true
    },
    colelctionName: {
        type: String
    },
    tokenId: {
        type: Number,
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    marketplace: {
        type: String
    }
})

const snipingBotScheme = new mongoose.Schema({
    accountAddress: {
        type: String
    },
    address: {
        // type: String
    },
    status: {
        // type: String
    },
    price: {
        min: {

        },
        max: {

        }
    },
    maxFeePerGas: {
        // type: Number
    },
    maxPriorityFeePerGas: {
        // type: Number
    },
    maxItems: {
        // type: Number
    },
    id: {
        // type: Number
    },
    keyAddress: {
        type: String
    }
})

const userSchema = mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    profileImage: {
    },
    watchList: {
        collectionWatchList: [String],
        nftWatchList: [String],
        addressWatchList: [String],
    },
    listSettings: {
        price: {
            type: {
                type: String,
                required: true
            },
            profitType: {
                type: String
            },
            profitValue: {
                type: String
            },
        },
        time: {
            months: {
                type: Number,
                required: true
            },
            days: {
                type: Number,
                required: true
            },
            hours: {
                type: Number,
                required: true
            },
            minutes: {
                type: Number,
                required: true
            },
        },
        marketplace: {
            type: String,
            required: true
        }
    },
    bots: {
        snipingBotTasks: {
            type: Array,
            snipingBotScheme
        }
    },
    shoppingCart: [
        cartSchema
    ],
    gasSettings: {
        label: {
            type: String,
        },
        value: {
            type: String
        },
        maxPriorityFeePerGas: {
            type: Number
        },
        custom: {
            maxPriorityFeePerGas: {
                type: Number
            },
            maxFeePerGas: {
                type: Number
            },
        }
    }
}, {
    timestamps: true
})


cartSchema.index({ "tokenId": 1, "contractAddress": 1 }, { unique: true })



module.exports = mongoose.model("User", userSchema)

