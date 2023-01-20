const express = require("express")
const checkAuth = require("../../../../middleware/checkAuth")

const profilePnlRoute = express()

profilePnlRoute.post("/", checkAuth, async (req, res)=> {

    const address = req.userDetails.address.toLowerCase()

    const etherscanApiKey = process.env.ETHERSCAN_API_KEY

    const {newUserItems, includePersonalAssets} = req.body    

        
    const fetchWalletTransactions = async () => {
        try{
            let walletTransactions = await fetch(`https://api.etherscan.io/api/?module=account&action=txlist&address=${address}&page=1&offset=10000&sort=desc&apikey=${etherscanApiKey}`)
            walletTransactions = await walletTransactions.json()
    
            let internalTransactions = await fetch(`https://api.etherscan.io/api/?module=account&action=txlistinternal&address=${address}&page=1&offset=10000&sort=desc&apikey=${etherscanApiKey}`)
            internalTransactions = await internalTransactions.json()
    
            let nftTransfers = await fetch(`https://api.etherscan.io/api/?module=account&action=tokennfttx&address=${address}&page=1&offset=10000&sort=desc&apikey=${etherscanApiKey}`)
            let nftTransfers1155 = await fetch(`https://api.etherscan.io/api/?module=account&action=token1155tx&address=${address}&page=1&offset=10000&sort=desc&apikey=${etherscanApiKey}`)
            nftTransfers = await nftTransfers.json()
            nftTransfers1155 = await nftTransfers1155.json()
            
            if(nftTransfers1155.result){
                nftTransfers.result.push(...nftTransfers1155.result)
            }
            
            nftTransfers.result.sort((a, b) => {
                return b.timeStamp - a.timeStamp
            })
            const totalNftTransactions = nftTransfers.result?.length

            calculateTrades(walletTransactions, internalTransactions, nftTransfers, totalNftTransactions)
        }
        catch(error){
            console.error(error)
            return res.status(400).json({message: "error trying to fetch data"})
        }
  
        function calculateTrades(walletTransactions, internalTransactions, nftTransfers, totalNftTransactions){
        let trades = []
        let PnlObject = {
            profit: [],
            loss: [],
            totalTransactions: 0,
            totalPnl: 0
        }
        let unrealizedPnlObject = {
            profit: [],
            loss: [],
            totalPnl: 0
        }
  
  
        nftTransfers.result.forEach(transfer => {
            let tradeObject = {}
            const {hash, contractAddress, tokenID} = transfer
            let value;
            let transactionType;
            let gas;
  
            if(transfer.from === address){
                transactionType = "sale/transfer"
                // è un sale e bisogna guardare nelle internal
                internalTransactions.result.forEach(tx => {
                    if(tx.hash === hash){
                    value = tx.value
                    }
                })
            }
            else if(transfer.to === address){
  
                if(transfer.from === "0x0000000000000000000000000000000000000000"){
                    transactionType = "mint"
                }
                else{
                    transactionType = "buy"
                }
                // è un buy/mint e bisogna guardare nelle normal tx
                walletTransactions.result.forEach(trans => {
                    if(trans.hash === hash){
                        value = trans.value
                        let gasPrice = trans.gasPrice
                        let gasUsed = trans.gasUsed
                        gas = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                    }
                })
            }
            
            value = value / 1000000000000000000
  
            tradeObject[transactionType === "sale/transfer" ? "sellPrice" : "buyPrice"] = value
            tradeObject["tokenId"] = tokenID
            tradeObject["contractAddress"] = contractAddress
            tradeObject[transactionType === "sale/transfer" ? "sellHash" : "buyHash"] = hash
            tradeObject["type"] = transactionType
            tradeObject["gas"] = gas
  
                trades.push(tradeObject)
        })
  
  
        let newTrades = [];
        let newTradesUnrealized = [];
        
        trades.forEach(tx => {
            let newTx = tx
            const contractAddress = tx.contractAddress
            const tokenId = tx.tokenId
            let buyPrice;
            let buyHash;
            let oldType = tx.type
            let newType;
            let gasFee
            let amountFound = 0;
  
            trades.forEach(trans => {
                if(trans.contractAddress === contractAddress && trans.tokenId === tokenId){
                    amountFound ++
                    buyPrice = trans.buyPrice
                    buyHash = trans.buyHash
                    newType = trans.type
                    gasFee = trans.gas
                }
            })

            

            newTx["buyPrice"] = buyPrice
            newTx["buyHash"] = buyHash
            newTx["gas"] = gasFee
            newTx["type"] = newType
  
            if(oldType === "sale/transfer"){
                if(!isNaN(buyPrice) && !isNaN(tx.sellPrice)){
                    newTrades.push(newTx)
                }
            }
            if(amountFound == 1){
              if(!isNaN(buyPrice)){
                newTradesUnrealized.push(tx)
              }
            }
          })
  
        
        let pnl = 0;
  
        newTrades.forEach(tx => {
            let amount = 0
            let sellAmount = 0
            let buyHash = tx.buyHash
            let sellHash = tx.sellHash
            let approvalFee = 0


            walletTransactions.result.forEach(transaction => {
                if(transaction.to === tx.contractAddress){
                    if(transaction.functionName.includes("setApproval")){
                        let gasPrice = transaction.gasPrice
                        let gasUsed = transaction.gasUsed
                        approvalFee = (gasPrice / 1000000000) * (gasUsed / 1000000000)
                    }
                }
            })
  
            newTrades.forEach(trans => {
                if(trans.buyHash === buyHash){
                    amount = amount + 1
                }
                if(trans.sellHash === sellHash){
                    sellAmount = sellAmount + 1
                }
            })


            tx.buyPrice = tx.buyPrice / amount
            tx.sellPrice = tx.sellPrice / sellAmount
            let newGas = tx.gas / amount
            let newPnl = tx.sellPrice - newGas - tx.buyPrice
            tx["amount"] = amount
            tx["gas"] = newGas
            tx["flipPnl"] = newPnl
            tx["approvalFee"] = approvalFee
            tx["isProfit"] = newPnl >= 0 ? true : false
  
            if(newPnl >= 0){
                PnlObject.profit.push(tx)
            }
            else{
                PnlObject.loss.push(tx)
            }
            pnl = pnl + newPnl
        })
        PnlObject.totalPnl = pnl 



        let unrealizedPnl = 0;
  
        newTradesUnrealized.forEach(tx => {
          let amount = 0
          let collectionFloorPrice;
          let collectionAveragePrice;
          let {buyHash, contractAddress} = tx
  

          if(includePersonalAssets){
              newUserItems.forEach(item => {
                  if(contractAddress === item.asset_contract.address){
                    collectionFloorPrice = item.stats.floor_price
                    collectionAveragePrice = item.stats.average_price
                  }
              })
          }
          else{
            collectionAveragePrice = 0
            collectionFloorPrice = 0
          }

          newTradesUnrealized.forEach(trans => {
              if(trans.buyHash === buyHash){
                  amount = amount + 1
              }
          })
  
          tx.buyPrice = tx.buyPrice / amount
          let newGas = tx.gas / amount
          let newPnl = collectionAveragePrice - newGas - tx.buyPrice
          tx["collectionFloorPrice"] = collectionFloorPrice
          tx["collectionAveragePrice"] = collectionAveragePrice
          tx["amount"] = amount
          tx["gas"] = newGas
          tx["unrealizedPnl"] = newPnl
          tx["isProfit"] = newPnl >= 0 ? true : false
  
          if(newPnl >= 0){
              unrealizedPnlObject.profit.push(tx)
          }
          else{
              unrealizedPnlObject.loss.push(tx)
          }
          unrealizedPnl = unrealizedPnl + newPnl
      })
      PnlObject.totalTransactions = totalNftTransactions
      unrealizedPnlObject.totalPnl = unrealizedPnl 

      let activityObj = []
      
      //   function activityTransactions(){
  
          nftTransfers.result.forEach(transfer => {
              let activityTx = transfer
  
              let hash = transfer.hash
              let value;
              let txType;
              let gasFee = (transfer.gasPrice / 1000000000) * (transfer.gasUsed / 1000000000)  
  
              if(transfer.from === address){
  
                  // è un sale o un send(transfer) e bisogna guardare nelle internal
                  //se è da me a 0x000000000 è un burn
                  // se la hash non c'è nelle internal tx allora è un transfer, se c'è è una sale
                  
                  if(transfer.to === "0x0000000000000000000000000000000000000000"){
                      transactionType = "burn"
                      value = 0
                    }
                    else{
                        let found = false

                        internalTransactions.result.forEach(tx => {
                        if(tx.hash === hash){
                            found = true
                            txType = "sale"
                            value = tx.value
                        }
                    })
                    if (!found){
                        txType = "send"
                        value = 0
                    }
                }


              }
              else if(transfer.to === address){
  
                  // è un mint / un buy o un receive(transfer)
  
                  if(transfer.from === "0x0000000000000000000000000000000000000000"){
                    txType = "mint"
                    walletTransactions.result.forEach(trans => {
                        if(trans.hash === hash){
                            value = trans.value
                        }
                    })
                }
                else{
                    let found = false
                    walletTransactions.result.forEach(tx => {
                        if(tx.hash === hash){
                            found = true
                            txType = "buy"
                            value = tx.value
                        }
                    })
                    if (!found){
                        value = 0
                        txType = "receive"
                    }
                }

  
              }
                    value = value / 1000000000000000000
                    activityTx["gasFee"] = gasFee
                    activityTx["type"] = txType
                    activityTx["value"] = value
                    activityObj.push(activityTx)

            })    

    //   }
  
        res.status(200).json({PnlObject, unrealizedPnlObject, newTrades, trades, activityObj})
        }
    }

    fetchWalletTransactions()
})


module.exports = profilePnlRoute
