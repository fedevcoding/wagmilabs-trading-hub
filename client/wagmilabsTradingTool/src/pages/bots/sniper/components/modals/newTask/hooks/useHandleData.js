import React, { useState, useEffect } from "react";

export const useHandleData = () => {
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

  const handleSetData = (dataIndex, data) => {
    console.log(dataIndex, data);
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
