import { useState, useEffect } from "react";
import { marketplaces } from "../options";
export const useSelectAll = (items, setItems) => {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([]);
  const [priceValue, setPriceValue] = useState("");
  const [selectedExpiration, setSelectedExpiration] = useState(undefined);

  useEffect(() => {
    for (let i = 0; i < marketplaces.length; i++) {
      const marketplace = marketplaces[i].value;
      const isSelectedMarketplaces =
        items.filter(item => item.marketplaces.find(m => m.name === marketplace)).length > 0;

      if (isSelectedMarketplaces)
        setSelectedMarketplaces(prevSelectedMarketplaces => [...prevSelectedMarketplaces, marketplace]);
    }
    const rightPrice = checkSamePrice(items);
    setPriceValue(rightPrice);

    const rightExpiration = checkExpiration(items);
    setSelectedExpiration(rightExpiration);
  }, [items]);

  function checkSamePrice(items) {
    const firstPrice = items[0]?.marketplaces[0]?.price;
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].marketplaces.length; j++) {
        if (items[i].marketplaces[j].price !== firstPrice) {
          return "";
        }
      }
    }
    return firstPrice;
  }

  function checkExpiration(items) {
    const firstExpiration = items[0]?.marketplaces[0]?.expiration;
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].marketplaces.length; j++) {
        if (items[i].marketplaces[j].expiration !== firstExpiration) {
          return undefined;
        }
      }
    }
    return firstExpiration;
  }

  const selectMarketplace = marketplace => {
    setSelectedMarketplaces(prevSelectedMarketplaces => [...prevSelectedMarketplaces, marketplace]);
  };

  const deselectMarketplace = marketplace => {
    setSelectedMarketplaces(prevSelectedMarketplaces => prevSelectedMarketplaces.filter(m => m !== marketplace));
  };

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

  const togglePrices = value => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        const newMarketplaces = item.marketplaces.map(marketplace => {
          return {
            ...marketplace,
            price: value,
          };
        });
        return {
          ...item,
          marketplaces: newMarketplaces,
        };
      });
      return newItems;
    });
  };

  const selectFp = () => {
    // set all item prices as it's floorPrice
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        const { floorPrice } = item;
        const newMarketplaces = item.marketplaces.map(marketplace => {
          return {
            ...marketplace,
            price: floorPrice || 0,
          };
        });
        return {
          ...item,
          marketplaces: newMarketplaces,
        };
      });
      console.log(newItems);
      return newItems;
    });
  };

  const selectAllExpirations = expiration => {
    // set all item expirations the same
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        const newMarketplaces = item.marketplaces.map(marketplace => {
          return {
            ...marketplace,
            expiration: expiration,
          };
        });
        return {
          ...item,
          marketplaces: newMarketplaces,
        };
      });
      return newItems;
    });
  };

  return {
    selectedMarketplaces,
    setSelectedMarketplaces,
    toggleMarketplace,
    priceValue,
    togglePrices,
    selectFp,
    selectAllExpirations,
    selectedExpiration,
  };
};
