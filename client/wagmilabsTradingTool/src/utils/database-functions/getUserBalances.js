import baseUrl from "../../variables/baseUrl"
import { fetchBalance } from "@wagmi/core"

async function getUserBalances(address, setUserBalances){


    let userBalances = await fetch(`${baseUrl}/userBalances`, {
        headers: {
            "x-auth-token": localStorage.jsonwebtoken
        }
    })
    userBalances = (await userBalances.json())
    
    const eth = (await fetchBalance({addressOrName: address})).formatted
    const {usdc, weth, usdt} = userBalances


    setUserBalances({eth, weth, usdc, usdt})
}

export default getUserBalances