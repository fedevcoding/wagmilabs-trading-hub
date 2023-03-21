import { useState } from "react";

export const useItemData = state => {
  const [items, setItems] = useState(state);

  const setMarketplace = (id, marketplace, isToAdd) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            marketplaces: [
              ...item.marketplaces,
              {
                name: marketplace,
                listingPrice: 0,
              },
            ],
          };
        }
        return item;
      });
      return newItems;
    });
  };

  const changeListPrice = (id, marketplace, price) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems.forEach(item => {
        if (item.id === id) {
          item.marketplaces.forEach(marketplaceItem => {
            if (marketplaceItem.name === marketplace) {
              marketplaceItem.price = price;
            }
          });
        }
      });
      return newItems;
    });
  };

  const changeDuration = (id, marketplace, expiration) => {
    expiration = new Date(expiration).getTime();
    console.log(expiration);
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems.forEach(item => {
        if (item.id === id) {
          item.marketplaces.forEach(marketplaceItem => {
            if (marketplaceItem.name === marketplace) {
              marketplaceItem.expiration = expiration;
            }
          });
        }
      });
      return newItems;
    });
  };

  return { items, setMarketplace, setItems, changeListPrice, changeDuration };
};
