import { baseUrl } from "@Variables";

async function removeFromCart(tokenId, contractAddress) {
  try {
    let res = await fetch(`${baseUrl}/updateUserCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken,
      },
      body: JSON.stringify({ tokenId, contractAddress, type: "remove" }),
    });

    if (!res.ok) throw new Error("error");

    res = await res.json();
    const { pushStatus, filteredItems } = res;
    return { pushStatus, filteredItems };
  } catch (e) {
    console.log(e);
    return { pushStatus: "error" };
  }
}

export default removeFromCart;
