import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetData(address) {
  const socket = useContext(SocketContext);

  const [totalListings, setTotalListings] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      const salesUrl = `/collectionSales/${address}`;
      const listingsUrl = `/collectionListings/${address}`;

      const [{ totalSales }, { totalListings }] = await Promise.all([
        getFromServer(salesUrl),
        getFromServer(listingsUrl),
      ]);

      setTotalSales(totalSales);

      setTotalListings(totalListings);

      setLoading(false);
    }

    async function listenToListings() {
      socket.on("listing", listingData => {
        const {
          // contractAddress,
          tokenId,
          price,
          image,
          name,
          timestamp,
          marketplace,
        } = listingData;

        const dataObj = {
          tokenId,
          value: price,
          image,
          name,
          timestamp,
          marketplace,
        };

        setTotalListings(oldListings => [...oldListings, dataObj]);
      });
    }

    async function listenToSales() {
      socket.on("sale", saleData => {
        const {
          tokenId,
          // tokenAddress,
          timestamp,
          marketplace,
          hash,
          value,
        } = saleData;
        const { name, image } = saleData?.tokenInfo;

        const dataObj = {
          tokenId,
          value,
          transactionHash: hash,
          timestamp,
          name,
          image,
          marketplace,
        };

        setTotalSales(oldSales => [...oldSales, dataObj]);
      });
    }
    getData();
    listenToListings();
    listenToSales();
  }, [address, socket]);

  useEffect(() => {
    setListings([...totalListings]?.reverse()?.splice(0, 50));
  }, [totalListings]);

  useEffect(() => {
    setSales([...totalSales]?.reverse()?.splice(0, 50));
  }, [totalSales]);

  return { isLoading, totalListings, totalSales, listings, sales };
}
