import React from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner, PageWrapper } from "../utility-components";
import { useGetData } from "./useGetData";

import "./style.css";

const Item = React.memo(() => {
  const { address, id } = useParams();
  const [details, isLoading] = useGetData(address, id);

  // eslint-disable-next-line no-lone-blocks
  {
    /**
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
 */
  }

  return (
    <PageWrapper page="token-detail">
      {(details && !isLoading && <h1>Data</h1>) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Item;
