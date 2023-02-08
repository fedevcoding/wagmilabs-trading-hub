import baseUrl from "../../variables/baseUrl";

async function getWatchListCollections(collectionAddress) {
  try {
    let res = await fetch(
      `${baseUrl}/getWatchList?collectionAddress=${collectionAddress}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
      }
    );
    if (!res.ok) throw new Error("error getting watchlist collection");
    res = await res.json();

    return res;
  } catch (e) {
    console.log(e);
  }
}

export default getWatchListCollections;
