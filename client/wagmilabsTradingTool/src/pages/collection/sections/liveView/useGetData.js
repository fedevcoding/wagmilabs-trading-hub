import { useEffect, useState, useContext, useRef } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetData(address, columnHovered) {
  const socket = useContext(SocketContext);

  const [hoveredListings, setHoveredListings] = useState([]);
  const [hoveredSales, setHoveredSales] = useState([]);

  const [totalListings, setTotalListings] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const columnHoveredRef = useRef(columnHovered)

  useEffect(()=>{
    columnHoveredRef.current = columnHovered
    if(!columnHovered.listings && hoveredListings.length > 0){
      setTotalListings(oldListings => [...oldListings, ...hoveredListings]);
    }

    if(!columnHovered.sales && hoveredSales.length > 0){
      setTotalSales(oldSales => [...oldSales, ...hoveredSales]);
    }
  }, [columnHovered, hoveredListings, hoveredSales])

  useEffect(()=>{
    if(hoveredListings.length > 0){
      setHoveredListings([]);
    }

    if(hoveredSales.length > 0){
      setHoveredSales([]);
    }
  }, [totalListings, totalSales, hoveredListings.length, hoveredSales.length])

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
    getData();


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

        
        !columnHoveredRef.current.listings ? setTotalListings(oldListings => [...oldListings, dataObj]) : setHoveredListings(oldListings => [...oldListings, dataObj]);
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

        !columnHoveredRef.current.sales ? setTotalSales(oldSales => [...oldSales, dataObj]) : setHoveredSales(oldSales => [...oldSales, dataObj]);
      });
    }
    listenToListings();
    listenToSales()
  }, [address, socket]);



  useEffect(() => {
    setListings([...totalListings]?.reverse()?.splice(0, 50));
  }, [totalListings]);

  useEffect(() => {
    setSales([...totalSales]?.reverse()?.splice(0, 50));
  }, [totalSales]);

  return { isLoading, totalListings, totalSales, listings, sales };
}
