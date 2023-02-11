import { useEffect, useState } from "react";
import { getFromServer } from "@Utils/functions/serverCalls";

export function useGetData(address) {
  const [totalListings, setTotalListings] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      const salesUrl = `/collectionSales/${address}`;
      // const listingsUrl = `/collectionListings/${address}`

      const { totalSales } = await getFromServer(salesUrl);
      console.time("start");
      const sales = [...totalSales].reverse().splice(0, 50);
      console.timeEnd("start");

      // const {totalListings} = await getFromServer(listingsUrl)
      // const listings = [...totalListings].splice(0, 50)

      setTotalSales(totalSales);
      setSales(sales);

      setTotalListings([]);
      setListings([]);

      setLoading(false);
    }
    getData();
  }, [address]);

  return { isLoading, totalListings, totalSales, listings, sales };
}
