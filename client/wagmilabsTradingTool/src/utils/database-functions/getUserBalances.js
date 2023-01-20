import baseUrl from "../../variables/baseUrl"
import { fetchBalance } from "@wagmi/core"

async function getUserBalances(address, setUserBalances){


    let userBalances = await fetch(`${baseUrl}/userBalances`, {
        headers: {
            "x-auth-token": localStorage.jsonwebtoken
        }
    })
    userBalances = (await userBalances.json()).data.tokenBalances
    
    const eth = (await fetchBalance({addressOrName: address})).formatted
    const usdc = parseInt(userBalances[0].tokenBalance) / 1000000
    const weth = parseInt(userBalances[1].tokenBalance) / 1000000
    const usdt = parseInt(userBalances[2].tokenBalance) / 1000000


    setUserBalances({eth, weth, usdc, usdt})
}

export default getUserBalances