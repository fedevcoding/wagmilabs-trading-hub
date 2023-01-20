const Web3 = require("web3")
const { ethers } = require("ethers")
require("dotenv").config()
const {contractAddress, abi} = require("../config/contractData")

const checkOwnership = async (req, res, next) => {

    const { address, signature, message } = req.body


    async function checkBalance(){

        const provider = new ethers.providers.InfuraProvider(null, process.env.SIGNER_PRIVATE_KEY);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.balanceOf(address)
        return balance.toString()
    }


    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NETWORK));
    
    if(address == undefined || address.length === 0 || signature == undefined || signature.length < 132){
        return res.status(400).json({message: "Failed to authenticate.", authenticated: false})
    }

    const signerAddress = await web3.eth.accounts.recover(message, signature)

    if(signerAddress.toLocaleLowerCase() === address.toLocaleLowerCase()){
        const balance = await checkBalance()
        if(balance >= 0){
            next()
        }
        else{
            return res.status(400).json({message: "Seems you do not have a wagmi labs pass in your wallet :(", authenticated: false})
        }
    }
    else{
        return res.status(400).json({message: "Failed to authenticate.", authenticated: false})
    }

}

module.exports = checkOwnership