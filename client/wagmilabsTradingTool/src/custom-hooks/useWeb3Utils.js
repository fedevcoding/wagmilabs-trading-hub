import { useProvider } from "./useProvider"
import { useSigner  } from "wagmi"
import {ethers} from "ethers"


const abiFunction = [
    {
        "name":"multiSendEther","outputs":[{"type":"bool","name":"out"}],
        "inputs":[{"type":"address[100]","name":"addresses"},{"type":"uint256[100]","name":"amounts"}], 
        "constant":false,"payable":true,"type":"function"
    }
]

const contractAddress = "0x941F40C2955EE09ba638409F67ef27C531fc055C"
export const useWeb3Utils = () => {

    const { data: signer } = useSigner()

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

    const batchTransferEth = async (value, toArray, valueArray) => {
        const contract = new ethers.Contract(contractAddress, abiFunction, signer)
        const totalValue = ethers.utils.parseEther(value)
        const tx = await contract.multiSendEther(toArray, valueArray, {value: totalValue})

    }

    return {getAddressAndBalance, generateWallets, batchTransferEth}
}