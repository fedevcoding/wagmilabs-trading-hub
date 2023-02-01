import React from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner, PageWrapper } from "../../utility-components";
import { useGetData } from "./useGetData";

import "./style.css";

const TokenDetail = React.memo(() => {
  const { address, id } = useParams();
  const [details, isLoading] = useGetData(address, id);

  return (
    <PageWrapper page="token-detail">
      {(details && !isLoading && <h1>Data</h1>) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default TokenDetail;
