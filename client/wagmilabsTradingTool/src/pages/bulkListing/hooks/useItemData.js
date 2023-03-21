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
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            listings: { ...item.listings, [marketplace]: price },
          };
        }
        return item;
      });
      return newItems;
    });
  };

  return { items, setMarketplace, setItems, changeListPrice };
};
