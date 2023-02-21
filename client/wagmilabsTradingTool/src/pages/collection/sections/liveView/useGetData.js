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
  const columnHoveredRef = useRef(columnHovered)

  const [listingChartObject, setListingChartObject] = useState({});

  useEffect(() => {
    columnHoveredRef.current = columnHovered
    if (!columnHovered.listings && hoveredListings.length > 0) {
      setTotalListings(oldListings => [...oldListings, ...hoveredListings]);
    }

    if (!columnHovered.sales && hoveredSales.length > 0) {
      setTotalSales(oldSales => [...oldSales, ...hoveredSales]);
    }
  }, [columnHovered, hoveredListings, hoveredSales])

  useEffect(() => {
    setHoveredListings([]);
    setHoveredSales([]);
  }, [totalListings, totalSales])

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
      console.log(totalSales)

      setTotalListings(totalListings);

      setLoading(false);
    }
    async function getReservoirListing() {
      const url = `https://api.reservoir.tools/tokens/floor/v1?collection=${address}`

      const api = await fetch(url)
      const { tokens } = await api.json()

      let offset = 0
      if (floorPrice < 0.005) offset = 0.001
      else if (floorPrice < 0.01) offset = 0.005
      else if (floorPrice < 0.05) offset = 0.01
      else if (floorPrice < 0.1) offset = 0.01
      else if (floorPrice < 0.1) offset = 0.05
      else if (floorPrice < 0.2) offset = 0.1
      else if (floorPrice < 0.4) offset = 0.3
      else if (floorPrice < 0.7) offset = 0.5
      else if (floorPrice < 1) offset = 0.7
      else if (floorPrice < 5) offset = 1.5
      else if (floorPrice < 10) offset = 5
      const columns = 25

      const maxPrice = floorPrice + columns * offset


      Object.keys(tokens).forEach(key => tokens[key] >= maxPrice && delete tokens[key])
      const values = Object.values(tokens)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const obj = {}
      for (let i = min; i < max; i += offset) {
        let valueMin = Number(i).toFixed(2)
        let valueMax = Number.parseFloat(i + offset).toFixed(2)
        obj[`${valueMin}-${valueMax}`] = 0
      }
      values.forEach(value => {
        Object.keys(obj).forEach(key => {
          const values = key.split("-")
          const min = values[0]
          const max = values[1]

          if (value > min && value <= max) obj[key] = obj[key] + 1
        })
      })

      setListingChartObject(obj)

    }
    getData();
    getReservoirListing()


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

  return { isLoading, totalListings, totalSales, listings, sales, listingChartObject };
}
