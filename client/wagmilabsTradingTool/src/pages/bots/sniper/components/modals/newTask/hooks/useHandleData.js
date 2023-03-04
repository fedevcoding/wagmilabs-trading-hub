import React, { useState, useEffect } from "react";

export const useHandleData = wallets => {
  const [data, setData] = useState({
    collection: {
      name: "",
      image: "",
      address: "",
    },
    minPrice: undefined,
    maxPrice: undefined,
    walletType: "privatekey",
    walletAddress: "",
    privateKey: "",
  });

  useEffect(() => {
    if (data?.walletAddress?.length > 0 && wallets?.length > 0) {
      const privateKey = wallets.find(
        wallet => wallet?.address?.toLowerCase() === data?.walletAddress?.toLowerCase()
      )?.privateKey;
      console.log(privateKey);
      setData(prevData => {
        return { ...prevData, privateKey };
      });
    }
  }, [data.walletAddress, wallets]);

  const handleSetData = (dataIndex, data) => {
    setData(prevData => {
      return { ...prevData, [dataIndex]: data };
    });
  };

  const handleCollectionClick = data => {
    const { name, image, collectionId } = data;

    setData(prevData => {
      return { ...prevData, collection: { name, image, address: collectionId } };
    });
  };

  const resetCollection = () => {
    setData(prevData => {
      return { ...prevData, collection: { name: "", image: "", address: "" } };
    });
  };

  const { collection, minPrice, maxPrice, walletType, walletAddress, privateKey } = data;
  return {
    collection,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    handleSetData,
    handleCollectionClick,
    resetCollection,
  };
};
