import { Button } from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { roundPrice } from "../../../../utils/formats/formats";

import "./liveview.css";

// images

import etherscan from "../../../../assets/etherscan.svg";
import getMarketplaceImage from "../../../../utils/marketplaceImageMapping";
import { SocketContext } from "../../../../context/SocketContext";

// utils

import { formatTime } from "../../../../utils/formats/formats";
import baseUrl from "../../../../variables/baseUrl";
import BuyNowModal from "../../../utility-components/BuyNowModal";

import { useBuyNow } from "../../../../custom-hooks";

const saleHashes = [];

const LiveView = ({ address, collectionName }) => {
  const socket = useContext(SocketContext);

  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [refreshDate, setRefreshDate] = useState();

  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [buyNowModalData, setBuyNowModalData] = useState({
    name: "",
    image: "",
    tokenId: "",
    price: "",
    marketplace: "",
    contract: "",
    collectionName: "",
  });

  function openBuyModal(
    name,
    image,
    tokenId,
    price,
    marketplace,
    contract,
    collectionName
  ) {
    document.body.style.overflow = "hidden";
    setBuyNowModalData({
      name,
      image,
      tokenId,
      price,
      marketplace,
      contract,
      collectionName,
    });
    setShowBuyNowModal(true);
  }

  function closeBuynowModal(e, force) {
    if (!force) if (e.target !== e.currentTarget) return;
    document.body.style.overflow = "unset";
    setShowBuyNowModal(false);
  }

  useEffect(() => {
    fetchListings();
    fetchSales();

    socket.emit("joinSales", address.toLowerCase());
    socket.emit("joinListings", address.toLowerCase());

    socket.on("sale", saleData => {
      const { tokenId, tokenAddress, timestamp, marketplace, hash, value } =
        saleData;
      const { name, image } = saleData?.tokenInfo;

      const dataObj = {
        liveSale: true,
        txHash: hash,
        price: value,
        timestamp: timestamp / 1000,
        token: {
          tokenId,
          tokenName: name,
          tokenImage: image,
        },
        order: {
          source: {
            name: marketplace,
          },
        },
      };
      if (tokenAddress.toLowerCase() === address.toLowerCase()) {
        setSales(oldSales => [dataObj, ...oldSales]);
      }
    });

    socket.on("listing", listingData => {
      const { contractAddress, tokenId, price, image, name, timestamp } =
        listingData;
      const { marketplace } = listingData;

      const dataObj = {
        liveListing: true,
        criteria: {
          data: {
            token: {
              name,
              tokenId,
              image,
            },
          },
        },
        source: {
          name: marketplace,
        },
        createdAt: timestamp * 1000,
        price: {
          amount: {
            decimal: price,
          },
        },
      };

      if (contractAddress.toLowerCase() === address.toLowerCase()) {
        setListings(oldListings => [dataObj, ...oldListings]);
      }
    });

    const dateInterval = setInterval(
      () => setRefreshDate(crypto.randomUUID()),
      1000
    );

    return () => {
      socket.emit("leaveSales", address.toLowerCase());
      socket.emit("leaveListings", address.toLowerCase());
      clearInterval(dateInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchListings() {
    try {
      const listingsData = await fetch(
        `${baseUrl}/collectionListings/${address}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );
      if (!listingsData.ok) throw new Error("error fetching listings data");
      const listingsApi = await listingsData.json();

      const { orders } = listingsApi;

      setListings(orders);
    } catch (e) {
      console.log(e);
      setListings([]);
    }
  }

  async function fetchSales() {
    try {
      const salesData = await fetch(`${baseUrl}/collectionSales/${address}`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });

      if (!salesData.ok) throw new Error("error fetching sales data");

      const salesApi = await salesData.json();

      const { activities } = salesApi;

      setSales(activities);
    } catch (e) {
      console.log(e);
      setSales([]);
    }
  }

  const { buyNow } = useBuyNow(() => {
    setBuyNowModalData({});
    closeBuynowModal(undefined, true);
  });

  const listingsMapping = useMemo(
    () =>
      listings.map(listing => {
        const { name, image, tokenId } = listing?.criteria?.data?.token || {};
        const readableValue = listing?.price?.amount?.decimal;
        const marketplace = listing?.source?.name;
        const listingTime = new Date(listing?.createdAt).getTime();
        const formatListingTime = formatTime(listingTime);

        const marketplaceImg = getMarketplaceImage(marketplace);

        const id = crypto.randomUUID();

        return (
          <div className="live-view-single-listing-item" key={id}>
            <div className="live-view-listing-container">
              <img src={image} className="live-view-listing-image" alt="" />
              <div>
                <p>{name || tokenId}</p>
                <p className="live-view-listing-time">{formatListingTime}</p>
              </div>
            </div>

            <div className="flex-col-left">
              <p>{roundPrice(readableValue)} ETH</p>
              <div className="live-view-listing-marketplace-container">
                <img
                  src={marketplaceImg}
                  className="live-view-listing-marketplace"
                  alt=""
                />
                <Button
                  colorScheme={"blue"}
                  className="live-view-buy"
                  onClick={() =>
                    openBuyModal(
                      name,
                      image,
                      tokenId,
                      readableValue,
                      marketplace,
                      address,
                      collectionName
                    )
                  }
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listings, refreshDate]
  );

  const salesMapping = useMemo(
    () =>
      sales.map(sale => {
        const { price, liveSale, timestamp, txHash } = sale;
        const { tokenName, tokenImage } = sale?.token;
        // const { collectionImage, collectionName } = sale?.collection || {}
        const { name: marketplaceName } = sale?.order?.source;

        const marketplaceImage = getMarketplaceImage(marketplaceName);

        const time = formatTime(timestamp * 1000);

        const randomUUID = crypto.randomUUID();
        return (
          <div
            key={randomUUID}
            className={`live-view-single-sale-item ${
              liveSale ? (saleHashes.includes(txHash) ? "" : "animate") : ""
            }`}
          >
            <div className="live-view-sale-container">
              <img src={tokenImage} className="live-view-sale-image" alt="" />
              <div>
                <p>{tokenName}</p>
                <p className="live-view-sale-time">{time}</p>
              </div>
            </div>

            <div className="flex-col-left">
              <p>{roundPrice(price)} ETH</p>
              <div className="live-view-sales-logos">
                <img src={marketplaceImage} alt="" />
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={etherscan} alt="" />
                </a>
              </div>
            </div>
            {(() => {
              !saleHashes.includes(txHash) &&
                liveSale &&
                saleHashes.push(txHash);
            })()}
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sales, refreshDate]
  );

  return (
    <div className="live-view-container">
      {
        <BuyNowModal
          buyNowModalData={buyNowModalData}
          showBuyNowModal={showBuyNowModal}
          buyNow={buyNow}
          closeBuynowModal={closeBuynowModal}
        />
      }
      <section className="live-view-section">
        <div className="live-view-listings-container">
          <p className="live-view-listing-text">Listings</p>

          <div className="live-view-listing-items">{listingsMapping}</div>
        </div>

        <div className="live-view-sales-container">
          <p className="live-view-sale-text">Sales</p>

          <div className="live-view-sale-items">{salesMapping}</div>
        </div>
      </section>
    </div>
  );
};

export default LiveView;
