import React, { useState, useEffect } from "react";

export const useHandleData = () => {
  const [data, setData] = useState({
    collection: {
      name: "",
      image: "",
      address: "",
    },
    minPrice: 0,
    maxPrice: 0,
    walletType: "",
    walletAddress: "",
    privateKey: "",
  });

  const handleSetData = data => {
    setData(data);
  };

  const { collection, minPrice, maxPrice, walletType, walletAddress, privateKey } = data;
  return { collection, minPrice, maxPrice, walletType, walletAddress, privateKey };
};
