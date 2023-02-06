const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const { getClient } = require("@reservoir0x/reservoir-sdk");
const { ethers } = require("ethers");
const User = require("../../../models/userModel")

const WebSocket = require('ws');
// const { OpenSeaStreamClient, Network } = require('@opensea/stream-js');

const { createClient } = require("@reservoir0x/reservoir-sdk");
const { newPendingSnipe, CLIENT_URL } = require("../../../server");


// reservoir client
createClient({
    apiBase: "https://api.reservoir.tools",
    apiKey: "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
    source: CLIENT_URL
});

const INFURA_API_KEY = "65b930ca2b6d44f3aca1217115af002e"
const provider = new ethers.providers.InfuraProvider("homestead", INFURA_API_KEY)



const saleBotRoute = express()


const usersTasks = {}

saleBotRoute.post("/", checkAuth, async (req, res) => {

    // const { taskInfo, type } = req.body

    // if (type === "create") {

    //     const { accountAddress, address, privateKey, price, maxFeePerGas, maxPriorityFeePerGas, maxItems, id } = taskInfo
    //     const { min, max } = price

    //     const keyAddress = await new ethers.Wallet(privateKey, provider).getAddress()


    //     const user = await User.findOne({ address: accountAddress })
    //     user.bots.snipingBotTasks = [...user.bots.snipingBotTasks, { accountAddress, status: "active", address, price: { min, max }, maxFeePerGas, maxPriorityFeePerGas, maxItems, id, keyAddress }]
    //     await user.save()

    //     const oldTasks = usersTasks[address] || []
    //     usersTasks[address] = [...oldTasks, { privateKey, accountAddress, min, max, maxFeePerGas, maxPriorityFeePerGas, maxItems, id, keyAddress }]

    //     res.json(usersTasks[address])
    // }
    // else if (type === "remove") {
    //     const { address, id } = taskInfo


    //     const user = await User.findOne({ address: "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E" })
    //     const filteredTasks = user.bots?.snipingBotTasks?.filter(task => task.id != id)
    //     user.bots.snipingBotTasks = [...filteredTasks]
    //     await user.save()

    //     const newTasks = usersTasks[address]?.filter(tasks => tasks.id != id)
    //     usersTasks[address] = newTasks ? [...newTasks] : []

    //     res.json(usersTasks[address])
    // }

})


const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// listenToListings()
// async function listenToListings() {
//     const client = new OpenSeaStreamClient({
//         token: '6cabe496f87d49b48869406c398f2af7',
//         network: Network.MAINNET,
//         connectOptions: {
//             transport: WebSocket
//         }
//     });
//     client.connect()
//     client.onItemListed("*", async (item) => {
//         const listingPrice = item.payload.base_price / 1000000000000000000
//         const details = item.payload.item.nft_id.split("/")
//         const contractAddress = details[1].toLowerCase()
//         const tokenId = details[2].toString()
//         // await wait(6000)
//         checkSnipe({ listingPrice, contractAddress, tokenId })
//     })
// }




// async function checkSnipe(data) {

//     try {
//         const { contractAddress, listingPrice, tokenId } = data

//         usersTasks[contractAddress]?.forEach(async task => {

//             const { max } = task

//             if (listingPrice <= max) {

//                 delete usersTasks[contractAddress][task]
//                 const { maxFeePerGas, maxPriorityFeePerGas, privateKey, accountAddress, id } = task

//                 newPendingSnipe(accountAddress, id)

//                 // const user = await User.findOne({address: accountAddress})
//                 // await user.save()
//                 executeSnipe({ maxFeePerGas, maxPriorityFeePerGas, listingPrice, contractAddress, tokenId, privateKey })
//             }
//         })
//     }
//     catch (e) {
//         console.log(e)
//     }


// }

// async function executeSnipe({ listingPrice, contractAddress, maxFeePerGas, maxPriorityFeePerGas, tokenId, privateKey }) {

//     const signer = new ethers.Wallet(privateKey, provider)

//     maxFeePerGas = maxFeePerGas * 1000000000
//     maxPriorityFeePerGas = maxPriorityFeePerGas * 1000000000

//     getClient()?.actions.buyToken({
//         tokens: [{ tokenId, contract: contractAddress }],
//         signer,
//         options: {
//             maxFeePerGas: `${maxFeePerGas}`,
//             maxPriorityFeePerGas: `${maxPriorityFeePerGas}`,
//             // skipBalanceCheck
//         },
//         expectedPrice: listingPrice,
//         onProgress: (steps) => {
//         }
//     })
//         .catch(e => console.log(e))
// }



module.exports = saleBotRoute