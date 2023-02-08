import baseUrl from "../../variables/baseUrl";

async function addToCart({
  name,
  collectionName,
  tokenId,
  price,
  image,
  marketplace,
  contractAddress,
}) {
  try {
    let res = await fetch(`${baseUrl}/updateUserCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.jsonwebtoken,
      },
      body: JSON.stringify({
        name,
        collectionName,
        tokenId,
        price,
        image,
        contractAddress,
        marketplace,
        type: "add",
      }),
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

export default addToCart;
