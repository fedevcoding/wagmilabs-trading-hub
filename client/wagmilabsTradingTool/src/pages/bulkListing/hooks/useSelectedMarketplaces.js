import { useState, useEffect } from "react";
import { marketplaces } from "../options";
export const useSelectedMarketplaces = (items, setItems) => {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([]);

  const selectMarketplace = marketplace => {
    setSelectedMarketplaces(prevSelectedMarketplaces => [...prevSelectedMarketplaces, marketplace]);
  };

  const deselectMarketplace = marketplace => {
    setSelectedMarketplaces(prevSelectedMarketplaces => prevSelectedMarketplaces.filter(m => m !== marketplace));
  };

  useEffect(() => {
    for (let i = 0; i < marketplaces.length; i++) {
      const marketplace = marketplaces[i].value;
      const isSelected = items.every(item => item.marketplaces?.includes(marketplace));
      if (isSelected) {
        setSelectedMarketplaces(prevSelectedMarketplaces => [...prevSelectedMarketplaces, marketplace]);
      }
    }
  }, [items]);

  const toggleMarketplace = (marketplace, isToRemove) => {
    if (isToRemove) {
      deselectMarketplace(marketplace);
    } else {
      selectMarketplace(marketplace);
    }
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (isToRemove) {
          return {
            ...item,
            marketplaces: item.marketplaces.filter(m => m.name !== marketplace),
          };
        } else {
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
      });

      // if (isToRemove) {
      //   // remove listings of deselected marketplace
      //   for (let i = 0; i < newItems.length; i++) {
      //     const item = newItems[i];
      //     if (item.listings[marketplace] || item.listings[marketplace] === 0) {
      //       delete item.listings[marketplace];
      //     }
      //   }
      // }

      return newItems;
    });
  };

  return { selectedMarketplaces, setSelectedMarketplaces, toggleMarketplace };
};
