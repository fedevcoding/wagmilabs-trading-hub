const { newPendingSnipe } = require("../../../server")

async function checkSnipe(){

    try{
        console.log("sending snipe")
        // const {contractAddress, listingPrice, tokenId} = data
        const contractAddress = "0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83".toLowerCase()
    
        usersTasks[contractAddress]?.forEach(async task => {

            const {accountAddress, id} = task

            newPendingSnipe(accountAddress, id)

            // const {max} = task
    
            // if(listingPrice <= max){
            //     delete usersTasks[contractAddress][task] 
            //     // console.log("found right listing")
            //     const {maxFeePerGas, maxPriorityFeePerGas, privateKey, accountAddress, id} = task

            //     // const user = await User.findOne({address: accountAddress})
            //     // await user.save()

            //     newPendingSnipe(accountAddress, id)
            //     executeSnipe({maxFeePerGas, maxPriorityFeePerGas, listingPrice, contractAddress, tokenId, privateKey})
            // }
        })
    }
    catch(e){
        console.log(e)
    }
}


module.exports = {checkSnipe}