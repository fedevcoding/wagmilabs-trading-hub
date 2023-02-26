import { useProvider } from "./useProvider"
const ethers = require("ethers")

export const useWeb3Utils = () => {
    const {web3} = useProvider()

    const getAddressAndBalance = async (privateKey) => {
        const account = await web3.eth.accounts.privateKeyToAccount(privateKey)
        const address = account.address
        const balance = await web3.eth.getBalance(address)
        return {address, balance}
    }

    const generateWallets = async (amount, name) => {
        const wallets = []
        for(let i = 0; i < amount; i++){
            const wallet = ethers.Wallet.createRandom()
            const {address, privateKey} = wallet
            const balance = 0
            const id = crypto.randomUUID()
            wallets.push({type: "generate", name, balance, privateKey, count: amount, id, address})
        }
        return wallets
    }

    return {getAddressAndBalance, generateWallets}
}