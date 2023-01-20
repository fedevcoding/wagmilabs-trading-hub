import React, { useEffect, useState } from 'react'
import baseUrl from "../../../../variables/baseUrl.js"
import { OpenSeaStreamClient, Network } from '@opensea/stream-js';
import { useParams } from 'react-router-dom';

const Activity = ({openseaSlug}) => {

  const params = useParams()


  const [listings, setListings] = useState(undefined)

  useEffect(()=>{
    const fetchActivity = async () => {
      try{
        let data = await fetch(`${baseUrl}/collectionListings/${params.address}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken
          }
        })
        data = await data.json()
        data = data.data
        setListings(data)
        const client = new OpenSeaStreamClient({
          network: Network.MAINNET,
          token: '2b069923a89d416aa68613d5543306e0'
        });
      
        client.onItemListed(openseaSlug, (item) => {
          const {name, image_url} = item?.payload?.item?.metadata
          // console.log(item)
          setListings(oldListings => [{asset_name: name, asset_image_url: image_url}, ...oldListings] )
        })
  
        // console.log(data)
      }
      catch(e){
        console.log(e)
      }
    }
    openseaSlug && fetchActivity()
  }, [openseaSlug])


  return (
    <>
    <div style={{color: "white"}}>Listings</div>
    
    <div>
      {
        listings && listings.map(listing => {

          const {asset_name, asset_image_url, marketplace, asset_id} = listing

          return(
            <>
              <img src={asset_image_url} alt="" style={{width: "30px"}}/>
              <p style={{color: "white"}}>{asset_name}</p>
            </>
          )
        })
      }
    </div>
    </>
  )
}

export default Activity