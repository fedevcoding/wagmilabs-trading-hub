import { useState } from "react";

export const useBulk = userItems => {
  const [bulkActive, setBulkActive] = useState(false);
  const [bulkItems, setBulkItems] = useState([]);

  const toggleBulk = state => {
    setBulkActive(state);
    if (!state) {
      setBulkItems([]);
    }
  };

  const changeBulkItems = (itemData, isSelected) => {
    if (isSelected) {
      setBulkItems(prevItems => {
        const filteredItems = prevItems?.filter(item => item.id !== itemData.id);
        return filteredItems;
      });
    } else {
      const newItems = [...bulkItems, itemData];
      setBulkItems(newItems);
    }
  };

  const selectAllBulkItems = () => {
    const bulkItems = userItems.map(item => {
      const { image, name } = item?.token || {};
      const contractAddress = item?.token?.contract;
      const tokenId = item?.token?.tokenId;
      const collectionName = item?.token?.collection?.name;
      const floorPrice = item?.token?.collection?.floorAskPrice;

      const id = `${contractAddress}:${tokenId}`;

      const itemData = { id, name, collectionName, image, contractAddress, tokenId, floorPrice };
      return itemData;
    });

    setBulkItems(bulkItems);
  };
  const clearAllBulkItems = () => {
    setBulkItems([]);
  };

  return { bulkActive, bulkItems, setBulkActive, toggleBulk, changeBulkItems, clearAllBulkItems, selectAllBulkItems };
};
