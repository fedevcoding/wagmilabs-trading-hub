import baseUrl from "../../variables/baseUrl"

async function getWatchListCollections(type, contract, setIsWatchList){
    let options = {
      type: type,
      contract: contract.toLowerCase()
    }
      let data = await fetch(`${baseUrl}/getWatchList`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.jsonwebtoken
          },
          body: JSON.stringify(options)
      })
      data = await data.json()
      if(data.includes){
          setIsWatchList(true)
      }
      else{
          setIsWatchList(false)
      }
  }

export default getWatchListCollections