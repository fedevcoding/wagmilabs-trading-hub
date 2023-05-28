import { baseUrl } from "@Variables";
import { fetchBalance } from "@wagmi/core";

async function getUserBalances(address, setUserBalances) {
  try {
    let userBalances = await fetch(`${baseUrl}/userBalances`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken,
      },
    });

    if (!userBalances.ok) throw new Error("error getting user balances");

    userBalances = await userBalances.json();
    const { usdc, weth, usdt } = userBalances;

    const eth = (await fetchBalance({ addressOrName: address }))?.formatted || 0;

    setUserBalances({ eth, weth, usdc, usdt });
  } catch (e) {
    console.log(e);
    setUserBalances({ eth: 0, weth: 0, usdc: 0, usdt: 0 });
  }
}

export default getUserBalances;
