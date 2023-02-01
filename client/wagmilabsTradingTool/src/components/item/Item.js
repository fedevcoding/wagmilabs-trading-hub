import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner, PageWrapper } from "../utility-components";
import { useGetData } from "./useGetData";

import "./style.css";

const Item = React.memo(() => {
  const { address, id } = useParams();
  const [details, isLoading] = useGetData(address, id);
  const navigate = useNavigate();

  console.log(details);

  return (
    <PageWrapper page="token-detail">
      {(details && !isLoading && (
        <div>
          <div className="item-container">
            <div className="item-image-container">
              <img className="item-image" src={details.token.image} alt="" />
              <div className="item-name-container">
                <div className="item-star-container">
                  <div className="item-name">{details.token.name}</div>
                </div>

                <div
                  className="item-collection-info"
                  onClick={() => navigate(`/collection/${address}`)}
                >
                  <img
                    className="item-collection-image"
                    src={details.token.collection.image}
                    alt={details.token.collection.name}
                  />
                  <div className="item-collection-name">
                    {details.token.collection.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) || <LoadingSpinner />}
    </PageWrapper>
  );
});

export default Item;
