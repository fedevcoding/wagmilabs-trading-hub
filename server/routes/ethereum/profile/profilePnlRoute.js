const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const User = require("../../../models/userModel")
const profilePnlRoute = express()

profilePnlRoute.get("/", checkAuth, async (req, res)=> {

    let {
        address,
        // signature
    } = req.userDetails

    const etherscanApiKey = process.env.ETHERSCAN_API_KEY

        
    const fetchWalletTransactions = async () => {
        try{
            address = address.toLowerCase()

            let tradeTxs = await fetch(`https://restapi.nftscan.com/api/v2/transactions/account/${address}?limit=1000`, {
                headers: {
                    "X-API-KEY": "ie1N5GckxvwErhgZ4MVnwr2S"
                }
            })
            tradeTxs = (await tradeTxs.json())?.data?.content

            console.log(tradeTxs)

            calculateTrades(tradeTxs)
        }
        catch(error){
            console.error(error)
            return res.status(400).json({message: "error trying to fetch data"})
        }



        async function calculateTrades(tradeTxs){
            console.time("start")

            const TRANSACTION_TYPES = {
                BUY: "buy",
                MINT: "mint",
                SELL: "sell",
                BURN: "burn",
                SEND: "send",
                RECEIVE: "receive",
            }
            const burnAddress = "0x0000000000000000000000000000000000000000"
            let realizedPnlObject = {
                profit: [],
                loss: [],
                totalTransactions: 0,
                totalPnl: 0
            }
            let realizedTrades = [];

            let trades = []


            for(let i = 0; i < nftTransfers.length; i++){
                transfer = nftTransfers[i]

                let tradeObject = {}
                const {hash, contractAddress, tokenID, from, to, gasPrice, gasUsed} = transfer
                
                let value;
                let transactionType;
                let gas;
                let nftOut;
                let isWeth = false
                
                if(from === address){
                    nftOut = true;
                    // puo essere: sell, burn, send

                    if(to === burnAddress){
                        transactionType = TRANSACTION_TYPES.BURN
                        gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                        value = 0
                    }
                    else{

                        let isInternal = false;
                        for(let i = 0; i < internalTransactions.length; i++){
                            if(internalTransactions[i].hash === hash){
                                value = internalTransactions[i].value
                                isInternal = true
                                break
                            }
                        }

                        if(isInternal){
                            transactionType = TRANSACTION_TYPES.SELL
                            gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                        }
                        else{
                            transactionType = TRANSACTION_TYPES.SEND
                            gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                            value = 0

                            erc20TokenTxs.forEach(tx => {
                                if(tx.hash === hash){
                                    transactionType = TRANSACTION_TYPES.SELL
                                    isWeth = true
                                    value = tx.value
                                }
                            })
                        }


                    }


                }
                else if(to === address){
                    nftOut = false;
                    // può essere: buy, mint, receive
                    let found = false;
                    let amount = 0;

                    nftTransfers.forEach(transfer => {
                        if(transfer.hash === hash){
                            amount ++
                        }
                    })
                    for(let i = 0; i < walletTransactions.length; i++){
                        if(walletTransactions[i].hash === hash){
                            found = true
                            const trans = walletTransactions[i]
                            value = trans.value
                            let gasPrice = trans.gasPrice
                            let gasUsed = trans.gasUsed
                            gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                        }
                    }
                    if(amount === 0) amount === 1

                    
                    if(from === burnAddress){
                        nftTransfers.forEach(tx => {
                            let amount = 0;
                            if(tx.hash === hash){
                                amount ++
                            }
                        })
                        if(amount === 0) amount = 1
                        value = value / amount
                        transactionType = TRANSACTION_TYPES.MINT
                    }
                    else if(found){
                        transactionType = TRANSACTION_TYPES.BUY
                        
                        if(amount > 1){
                            try{
                                let txInternals = await fetch(`https://api.etherscan.io/api/?module=account&action=txlistinternal&txHash=${hash}&page=1&offset=10000&sort=desc&apikey=${etherscanApiKey}`)
                                txInternals = (await txInternals.json()).result

                                txInternals.forEach(tx => {
                                    if(from === tx.to){
                                        value = tx.value
                                    }
                                })
                            }
                            catch(e){
                                console.log("error fetching internal of transaction")
                            }

                        }

                    }
                    else{
                        transactionType = TRANSACTION_TYPES.RECEIVE
                        gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                        value = 0

                        erc20TokenTxs.forEach(tx => {
                            if(tx.hash === hash){
                                transactionType = TRANSACTION_TYPES.BUY
                                isWeth = true
                                value = tx.value
                            }
                        })
                    }

                }
                
                value = value / 1000000000000000000
                
                tradeObject = transfer
                tradeObject[nftOut ? "sellPrice" : "buyPrice"] = value
                tradeObject["value"] = value
                tradeObject["nftOut"] = nftOut
                tradeObject["tokenId"] = tokenID
                tradeObject["contractAddress"] = contractAddress
                tradeObject[nftOut ? "sellHash" : "buyHash"] = hash
                tradeObject["hash"] = hash
                tradeObject["type"] = transactionType
                tradeObject["gas"] = gas
                tradeObject["isWeth"] = isWeth


                trades.push(tradeObject)
            }

            let updatedTrades = trades

            updatedTrades.forEach(updatedTrade => {
                const {contractAddress, tokenId, nftOut, value, hash, type} = updatedTrade
                let buyHash;
                let gasFee;
                let buyPrice;
                let buyType;
                let count = 0;
                let amountFound = 0
                let inWallet;


                if(nftOut){
                    for(let i = 0; i < trades.length; i++){
                        if(trades[i].contractAddress === contractAddress && trades[i].tokenId === tokenId && !trades[i].nftOut){
                            trades[i]["sellPrice"] = value
                            trades[i]["sellHash"] = hash
                            buyPrice = trades[i].buyPrice
                            buyHash = trades[i].buyHash
                            buyType = trades[i].type
                            gasFee = trades[i].gas
                            count++
                        }
                    }
                    updatedTrade["buyPrice"] = buyPrice || 0
                    updatedTrade["buyHash"] = buyHash || 0
                    updatedTrade["buyGas"] = gasFee || 0
                    updatedTrade["buyType"] = buyType || 0
                }

                let approvalFee = 0

                walletTransactions.forEach(transaction => {
                    if(transaction.to === contractAddress){
                        if(transaction.functionName.includes("setApproval")){
                            let gasPrice = transaction.gasPrice
                            let gasUsed = transaction.gasUsed
                            approvalFee = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                        }
                    }
                })
                updatedTrade["approvalFee"] = approvalFee


                trades.forEach(trans => {
                    if(trans.contractAddress === contractAddress && trans.tokenId === tokenId){
                        amountFound ++
                    }
                })
                if(amountFound > 1) inWallet = false
                else if(amountFound === 1) inWallet = true


                if(type === TRANSACTION_TYPES.SELL){
                    // realized trade
                    // if(!isNaN(buyPrice) && !isNaN(updatedTrade.sellPrice)){
                        realizedTrades.push(updatedTrade)
                    // }
                }
                else if(inWallet){
                    // if(!isNaN(buyPrice)){
                        unrealizedTrades.push(updatedTrade)
                    // }
                }
                
            })



            let pnl = 0

            realizedTrades.forEach((tx, index) => {
                let {buyHash, gas, buyPrice, approvalFee, sellPrice, buyType} = tx
                
                if(!buyPrice) buyPrice = 0

                let amount = 0;
                let newBuyPrice;
                let newGas;
                let newPnl;

                updatedTrades.forEach(trade => {
                    if(trade.buyHash === buyHash && !trade.nftOut){
                        amount ++
                    }
                })

                if(amount === 0) amount = 1

                if(buyType !== TRANSACTION_TYPES.MINT){
                    newBuyPrice = buyPrice / amount
                }
                else{
                    newBuyPrice = buyPrice
                }
                newGas = gas / amount
                newPnl = sellPrice - newGas - newBuyPrice - approvalFee

                tx["amount"] = amount
                tx["singleGas"] = newGas
                tx["singleBuyPrice"] = newBuyPrice
                tx["pnl"] = newPnl
                tx["isProfit"] = newPnl > 0 ? true : false

                pnl+=newPnl
                
                if(newPnl > 0) realizedPnlObject.profit.push(tx)
                else realizedPnlObject.loss.push(tx)
            })

            realizedPnlObject.totalPnl = pnl



            realizedPnlObject.totalTransactions = totalNftTransactions

            console.timeEnd("start")

            res.status(200).json({
                realizedPnlObject,
                trades})
        }

    }

    fetchWalletTransactions()
})


module.exports = profilePnlRoute