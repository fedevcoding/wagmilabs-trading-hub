import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import "./item.css"
import fullStar from "../../assets/full-star.png"
import emptyStar from "../../assets/empty-star.png"
import removeFromWatchList from '../../utils/database-functions/removeFromWatchList';
import addToWatchList from '../../utils/database-functions/addToWatchList';
import getWatchListCollections from '../../utils/database-functions/getWatchList';

const Item = () => {
  const params = useParams();
  const navigate = useNavigate()

  const [itemData, setItemData] = useState(null)
  const [isWatchList, setIsWatchList] = useState()

  useEffect(()=>{
        getWatchListCollections("nft", `${params.address}/${params.id}`, setIsWatchList)
  }, [])

  useEffect(()=>{
    async function getNftInfo(){
      let data = await fetch(`https://api.opensea.io/api/v1/asset/${params.address}/${params.id}/?include_orders=false`)
      data = await data.json()

      console.log(data)
      setItemData([data])
    }
    getNftInfo()
  }, [])


  return (
    <div>
      {
        itemData && itemData.map(item => {
          const image_url = item?.image_url
          const collectionImage = item?.collection?.image_url
          const name = item?.name
          const collectionName = item?.collection?.name
          return(
            <div className='item-container'>
              <div className='item-image-container'>
                <img className='item-image' src={image_url} alt="" />
                <div className='item-name-container'>
                  <div className='item-star-container'>
                    <div className='item-name'>{name}</div>
                    <img onClick={isWatchList ? () => removeFromWatchList("nft", `${params.address}/${params.id}`, setIsWatchList) : () => addToWatchList("nft", `${params.address}/${params.id}`, setIsWatchList)} className='starWatchlist' src={isWatchList ? fullStar : emptyStar} alt="" />
                  </div>

                  <div className='item-collection-info' onClick={()=> navigate(`/collection/${params.address}`)}>
                    <img className='item-collection-image' src={collectionImage} />
                    <div className='item-collection-name'>{collectionName}</div>
                  </div>
                </div>
              </div>

            </div>
          )
        })
      }
    </div>
  )
}

export default Item