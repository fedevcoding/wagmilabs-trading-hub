import { useEffect, useState, useContext } from "react";
import { getFromServer } from "../../../../utils/functions/serverCalls.js"
import { SocketContext } from '../../../../context/SocketContext'

export function useGetData(address) {

  const socket = useContext(SocketContext)

  const [totalListings, setTotalListings] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const lowerCasedAddress = address.toLowerCase()

    async function getData() {

      setLoading(true);

      const salesUrl = `/collectionSales/${address}`
      const listingsUrl = `/collectionListings/${address}`


      const { totalSales } = await getFromServer(salesUrl)

      const { totalListings } = await getFromServer(listingsUrl)

      setTotalSales(totalSales)

      setTotalListings(totalListings)

      setLoading(false);
    }

    async function listenToListings() {
      socket.emit("joinListings", lowerCasedAddress)

      socket.on("listing", (listingData) => {

        const {
          // contractAddress, 
          tokenId, price, image, name, timestamp, marketplace } = listingData

        const dataObj = { tokenId, value: price, image, name, timestamp, marketplace }

        setTotalListings(oldListings => [...oldListings, dataObj])
      })
    }

    async function listenToSales() {

      socket.emit("joinSales", lowerCasedAddress)

      socket.on("sale", (saleData) => {

        const { tokenId,
          // tokenAddress,
          timestamp, marketplace, hash, value } = saleData
        const { name, image } = saleData?.tokenInfo

        const dataObj = {
          tokenId, value, transactionHash: hash, timestamp, name, image, marketplace
        }

        setTotalSales(oldSales => [...oldSales, dataObj])
      })
    }
    getData()
    listenToListings()
    listenToSales()

    return () => {
      socket.emit("leaveListings", lowerCasedAddress)
      socket.emit("leaveSales", lowerCasedAddress)
    }

  }, [address, socket]);


  useEffect(() => {
    setListings([...totalListings]?.reverse()?.splice(0, 50))
  }, [totalListings])

  useEffect(() => {
    setSales([...totalSales]?.reverse()?.splice(0, 50))
  }, [totalSales])




  return { isLoading, totalListings, totalSales, listings, sales };
}
