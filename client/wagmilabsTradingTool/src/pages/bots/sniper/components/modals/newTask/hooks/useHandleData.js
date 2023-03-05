import { useState, useEffect, useMemo } from "react";

export const useHandleData = (wallets, step) => {
  const [data, setData] = useState({
    collection: {
      name: undefined,
      image: undefined,
      address: undefined,
    },
    minPrice: undefined,
    maxPrice: undefined,
    walletType: "privatekey",
    walletAddress: undefined,
    privateKey: undefined,
    maxFeePerGas: undefined,
    maxPriorityFeePerGas: undefined,
    maxAutoBuy: undefined,
  });

  useEffect(() => {
    if (data?.walletAddress?.length > 0 && wallets?.length > 0) {
      const privateKey = wallets.find(
        wallet => wallet?.address?.toLowerCase() === data?.walletAddress?.toLowerCase()
      )?.privateKey;
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

  const isValidNextStep = useMemo(() => {
    const {
      collection,
      maxPrice,
      walletType,
      walletAddress,
      privateKey,
      // maxFeePerGas,
      maxPriorityFeePerGas,
      maxAutoBuy,
    } = data;
    if (step === 1) {
      if (walletType === "privatekey")
        return collection.address && maxPrice && privateKey?.length === 64 ? true : false;
      else return collection.address && maxPrice && walletAddress && privateKey?.length === 64 ? true : false;
    } else if (step === 2) {
      return maxPriorityFeePerGas && maxAutoBuy ? true : false;
    }
  }, [data, step]);

  const resetData = () => {
    setData({
      collection: {
        name: undefined,
        image: undefined,
        address: undefined,
      },
      minPrice: undefined,
      maxPrice: undefined,
      walletType: "privatekey",
      walletAddress: undefined,
      privateKey: undefined,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
      maxAutoBuy: undefined,
    });
  };

  const { collection, minPrice, maxPrice, walletType, walletAddress, privateKey, maxFeePerGas, maxAutoBuy } = data;
  return {
    collection,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    maxFeePerGas,
    maxAutoBuy,
    data,
    handleSetData,
    handleCollectionClick,
    resetCollection,
    isValidNextStep,
    resetData,
  };
};
