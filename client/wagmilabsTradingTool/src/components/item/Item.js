import React from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner, PageWrapper } from "../utility-components";
import { useGetData } from "./useGetData";
import { ImageCol, InfoCol } from "./Components";

import "./style.css";

const Item = React.memo(() => {
  const { address, id } = useParams();
  const [details, isLoading] = useGetData(address, id);

  return (
    <PageWrapper page="token-detail">
      {(details && !isLoading && (
        <div className="nft-container">
          <ImageCol details={details} address={address} />
          <InfoCol details={details} address={address} id={id} />
        </div>
      )) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Item;
