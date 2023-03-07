import React from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner, PageWrapper } from "@Components";
import { useGetData } from "./useGetData";
import { ImageCol, InfoCol, ItemActivity } from "./Components";

import "./style.scss";

const Item = React.memo(() => {
  const { address, id } = useParams();
  const [details, isLoading] = useGetData(address, id);

  return (
    <PageWrapper page="token-detail">
      {(details && !isLoading && (
        <>
          <div className="nft-container">
            <ImageCol details={details} address={address} id={id} />
            <InfoCol details={details} address={address} id={id} />
          </div>
          <ItemActivity address={address} id={id} market={details?.market} />
        </>
      )) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Item;
