import { useEffect, useState, useContext, useRef } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetData(address, columnHovered, floorPrice) {
  const socket = useContext(SocketContext);

  const [hoveredListings, setHoveredListings] = useState([]);
  const [hoveredSales, setHoveredSales] = useState([]);

  const [totalListings, setTotalListings] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const columnHoveredRef = useRef(columnHovered);

  const [tokens, setTokens] = useState({});

  useEffect(() => {
    columnHoveredRef.current = columnHovered;
    if (!columnHovered.listings && hoveredListings.length > 0) {
      setTotalListings(oldListings => [...oldListings, ...hoveredListings]);
    }

    if (!columnHovered.sales && hoveredSales.length > 0) {
      setTotalSales(oldSales => [...oldSales, ...hoveredSales]);
    }
  }, [columnHovered, hoveredListings, hoveredSales]);

  useEffect(() => {
    setHoveredListings([]);
    setHoveredSales([]);
  }, [totalListings, totalSales]);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      const salesUrl = `/collectionSales/${address}`;
      const listingsUrl = `/collectionListings/${address}`;

      const [{ totalSales }, { totalListings }] = await Promise.all([
        getFromServer(salesUrl),
        getFromServer(listingsUrl),
      ]);

      setTotalSales(totalSales || []);
      setTotalListings(totalListings || []);
      setLoading(false);
    }
    async function getReservoirListing() {
      const url = `https://api.reservoir.tools/tokens/floor/v1?collection=${address}`;

      const api = await fetch(url);
      const { tokens } = await api.json();

      setTokens(tokens);
    }
    getData();
    getReservoirListing();

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
          ms,
          orderHash,
        } = listingData;

        const dataObj = {
          tokenId,
          value: price,
          image,
          name,
          timestamp,
          marketplace,
          ms,
          orderHash,
        };

        setTokens(old => ({ ...old, [tokenId]: price }));
        !columnHoveredRef.current.listings
          ? setTotalListings(oldListings => [...oldListings, dataObj])
          : setHoveredListings(oldListings => [...oldListings, dataObj]);
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

        setTokens(old => {
          const newTokens = { ...old };
          delete newTokens[tokenId];

          return newTokens;
        });
        !columnHoveredRef.current.sales
          ? setTotalSales(oldSales => [...oldSales, dataObj])
          : setHoveredSales(oldSales => [...oldSales, dataObj]);
      });
    }
    listenToListings();
    listenToSales();

    return () => {
      socket.off("listing");
      socket.off("sale");
    };
  }, [address, socket, floorPrice]);

  useEffect(() => {
    setListings([...totalListings]?.reverse()?.splice(0, 50));
  }, [totalListings]);

  useEffect(() => {
    setSales([...totalSales]?.reverse()?.splice(0, 50));
  }, [totalSales]);

  return { isLoading, totalListings, totalSales, listings, sales, tokens };
}
