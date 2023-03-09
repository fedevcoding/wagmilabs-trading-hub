import { useState, useEffect, useMemo } from "react";

const defaultData = {
  collectionName: undefined,
  collectionImage: undefined,
  collectionAddress: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  walletType: "privatekey",
  walletAddress: undefined,
  privateKey: undefined,
  maxFeePerGas: undefined,
  maxFeePerGasType: "auto",
  maxPriorityFeePerGas: undefined,
  maxAutoBuy: undefined,
  status: "active",
  remaining: undefined,
};

export const useHandleData = (wallets, step) => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if (data?.walletAddress?.length > 0 && wallets?.length > 0) {
      const privateKey = wallets.find(wallet => wallet?.address === data?.walletAddress)?.privateKey;
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
      return { ...prevData, collectionAddress: collectionId, collectionImage: image, collectionName: name };
    });
  };

  const resetCollection = () => {
    setData(prevData => {
      return { ...prevData, collectionAddress: undefined, collectionImage: undefined, collectionName: undefined };
    });
  };

  const isValidNextStep = useMemo(() => {
    const { maxPrice, walletType, walletAddress, privateKey, maxPriorityFeePerGas, maxAutoBuy, collectionAddress } =
      data;
    if (step === 1) {
      if (walletType === "privatekey")
        return collectionAddress && maxPrice && (privateKey?.length === 64 || privateKey?.length === 66) ? true : false;
      else
        return collectionAddress &&
          maxPrice &&
          walletAddress &&
          (privateKey?.length === 64 || privateKey?.length === 66)
          ? true
          : false;
    } else if (step === 2) {
      return maxPriorityFeePerGas && maxAutoBuy ? true : false;
    }
  }, [data, step]);

  const resetData = () => {
    setData(defaultData);
  };

  const {
    collectionAddress,
    collectionImage,
    collectionName,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    maxFeePerGas,
    maxPriorityFeePerGas,
    maxAutoBuy,
    maxFeePerGasType,
  } = data;
  return {
    collectionAddress,
    collectionImage,
    collectionName,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    maxFeePerGas,
    maxPriorityFeePerGas,
    maxAutoBuy,
    data,
    maxFeePerGasType,
    handleSetData,
    handleCollectionClick,
    resetCollection,
    isValidNextStep,
    resetData,
  };
};
