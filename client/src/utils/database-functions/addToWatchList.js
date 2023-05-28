import { baseUrl } from "@Variables";

async function addToWatchList(address) {
  try {
    let res = await fetch(
      `${baseUrl}/updateWatchList?method=add&collectionAddress=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Error adding to watchlist");
    }

    return true;
  } catch (e) {
    return false;
  }
}

export default addToWatchList;
