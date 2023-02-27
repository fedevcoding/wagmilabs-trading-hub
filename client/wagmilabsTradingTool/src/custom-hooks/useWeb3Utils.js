import { useProvider } from "./useProvider"
const ethers = require("ethers")

export const useWeb3Utils = () => {
    const {web3} = useProvider()

    const getAddressAndBalance = async (privateKey) => {
        const account = await web3.eth.accounts.privateKeyToAccount(privateKey)
        const address = account.address
        const balance = (await web3.eth.getBalance(address)) / 10 ** 18
        return {address, balance}
    }

    const generateWallets = async (amount, name, date) => {
        const wallets = []
        for(let i = 0; i < amount; i++){
            const wallet = ethers.Wallet.createRandom()
            const {address, privateKey} = wallet
            const id = crypto.randomUUID()
            const newName = `${name} ${i + 1}`
            wallets.push({type: "generate", name: newName, date, balance: 0, privateKey, id, address})
        }
        return wallets
    }

    return {getAddressAndBalance, generateWallets}
}