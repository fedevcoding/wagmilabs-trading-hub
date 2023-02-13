import React from "react";
import { BuyNowModal } from "@Components";
import { useGetItemFunctions, useGetBuyNowModalFunctions } from "@Hooks";
import { useGetVariables } from "./useGetVariables";

export const BuyNow = React.memo(({ details, address, tokenId, value }) => {
  const { buyNow } = useGetItemFunctions(address);
  const { buyNowModalData, showBuyNowModal, openBuyModal, closeBuynowModal } =
    useGetBuyNowModalFunctions();

  const { marketplace, name, image, collectionName } = useGetVariables(details);

  return (
    <>
      <BuyNowModal
        buyNowModalData={buyNowModalData}
        showBuyNowModal={showBuyNowModal}
        buyNow={buyNow}
        closeBuynowModal={closeBuynowModal}
      />
      <div
        className="btn"
        onClick={() =>
          openBuyModal(
            name,
            image,
            tokenId,
            value,
            marketplace,
            address,
            collectionName
          )
        }
      >
        <i className="fa fa-bolt" />
        Buy now
      </div>
    </>
  );
});
