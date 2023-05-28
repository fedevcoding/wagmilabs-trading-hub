import React from "react";

export const useGetBuyNowModalFunctions = () => {
  const [showBuyNowModal, setShowBuyNowModal] = React.useState(false);
  const [buyNowModalData, setBuyNowModalData] = React.useState({
    name: "",
    image: "",
    tokenId: "",
    price: "",
    marketplace: "",
    contract: "",
    collectionName: "",
    orderHash: "",
  });

  function openBuyModal(name, image, tokenId, price, marketplace, contract, collectionName, orderHash) {
    document.body.style.overflow = "hidden";
    setBuyNowModalData({
      name,
      image,
      tokenId,
      price,
      marketplace,
      contract,
      collectionName,
      orderHash,
    });
    setShowBuyNowModal(true);
  }

  function closeBuynowModal(e, force) {
    if (!force) if (e.target !== e.currentTarget) return false;
    document.body.style.overflow = "unset";
    setShowBuyNowModal(false);
    return true;
  }

  return {
    buyNowModalData,
    showBuyNowModal,
    openBuyModal,
    closeBuynowModal,
    setBuyNowModalData,
  };
};
