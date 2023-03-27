import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { placeholderImage, etherscan, opensea, x2y2, www, twitter, looksRare, discord, gem } from "@Assets";

import Items from "./sections/items/Items";
import Activity from "./sections/activity/Activity";
import Charts from "./sections/charts/Charts.jsx";
import Leaderboard from "./sections/leaderboard/Leaderboard";

// import { useMoralisWeb3Api } from "react-moralis";
import "./collection.css";

import { baseUrl } from "@Variables";
import removeFromWatchList from "@Utils/database-functions/removeFromWatchList";
import addToWatchList from "@Utils/database-functions/addToWatchList";
import getWatchListCollections from "@Utils/database-functions/getWatchList";
import { getPercentage } from "@Utils/formats/utils";
import { formatContractAddress, roundPrice } from "@Utils/formats/formats";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import LiveView from "./sections/liveView/index";
import { LivePulsing } from "@Components";

// import verified from "../../images/verified-2.png"
// import notVerified from "../../images/not-verified.png"

// utils
import { formatTime } from "@Utils/formats/formats";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";

import copy from "copy-to-clipboard";
import { useDebounce } from "use-debounce";
import { Badge, useToast } from "@chakra-ui/react";
import { setPageTitle } from "@Utils";
import { SocketContext } from "src/context/SocketContext";

// Item.js
const options = [
  { value: "p-lth", label: "Price: low to high" },
  { value: "p-htl", label: "Price: high to low" },
  { value: "t-lth", label: "TokenId: low to high" },
  { value: "t-htl", label: "TokenId: high to low" },
  { value: "r-htl", label: "Rarity: high to low" },
  { value: "r-lth", label: "Rarity: low to high" },
];

const Collection = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const socket = useContext(SocketContext);
  const { address } = useParams();

  const [collectionInfo, setCollectionInfo] = useState({});
  const [extra, setExtra] = useState(false);
  const [isWatchList, setIsWatchList] = useState();
  const [section, setSection] = useState("items");
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [copyState, setCopyState] = useState({ hovered: false, value: "Copy" });

  // items.js states
  const [itemFilters, setItemFilters] = useState({
    sortBy: "p-lth",
    attributeFilter: [],
    buyNowChecked: false,
    priceFilter: {
      min: undefined,
      max: undefined,
    },
    tokenId: undefined,
  });
  const [loadingItems, setLoadingItems] = useState(true);

  const [loadingMoreItems, setLoadingMoreItems] = useState(false);
  const tokensContinuation = useRef(false);

  const [buyNowChecked, setBuyNowChecked] = useState(false);
  const [items, setItems] = useState([]);
  const itemRef = useRef(items);
  const [searchText, setSearchText] = useState("");
  const [debounceSearch] = useDebounce(searchText, 400);
  const [selectedItem, setSelectedItem] = useState(options[0]);

  const [liveItems, setLiveItems] = useState(true);

  useEffect(() => {
    if (address) {
      if (!address.startsWith("0x") || address.length !== 42) {
        navigate("notfound");
      } else {
        checkIfWatchlist();
        getInfo();
      }

      socket.emit("joinListings", address);
      socket.emit("joinSales", address);

      socket.on("listing", listingData => {
        addNewListing(listingData);
      });

      socket.on("sale", saleData => {
        const { tokenId } = saleData;

        addNewSale(tokenId);
      });

      return () => {
        socket.emit("leaveListings", address.toLowerCase());
        socket.emit("leaveSales", address.toLowerCase());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  function addNewListing(listingData) {
    const { tokenId, price, image, name, timestamp, marketplace, rarity, rarityRank, orderHash, isFlagged } =
      listingData;

    if (
      (itemFilters.tokenId !== undefined && itemFilters.tokenId !== "") ||
      itemFilters.attributeFilter.length > 0 ||
      (itemFilters.sortBy !== "p-lth" && itemFilters.sortBy !== "p-htl")
    ) {
      return;
    }

    if (itemFilters.priceFilter.min > price || itemFilters.priceFilter.max < price) return;

    const newListing = {
      token: {
        isLive: true,
        tokenId,
        name,
        image,
        isFlagged,
        rarity,
        rarityRank,
      },
      market: {
        floorAsk: {
          id: orderHash,
          price: {
            amount: {
              decimal: price,
            },
          },
          source: {
            name: marketplace,
            icon: "",
            url: "",
          },
          validFrom: timestamp,
        },
      },
    };
    const oldItems = itemRef.current;

    for (let i = 0; i < oldItems.length; i++) {
      const item = oldItems[i];

      item.token.isLive = false;
      if (item?.token?.tokenId === tokenId) {
        oldItems.splice(i, 1);
      }
    }

    if (itemFilters.sortBy === "p-lth") {
      if (price > oldItems[oldItems.length - 1]?.market?.floorAsk?.price?.amount?.decimal) return;

      const newItems = [newListing, ...oldItems].sort((a, b) => {
        return a?.market?.floorAsk?.price?.amount?.decimal - b?.market?.floorAsk?.price?.amount?.decimal;
      });

      setItems(newItems);
    } else if (itemFilters.sortBy === "p-htl") {
      if (price < oldItems[oldItems.length - 1]?.market?.floorAsk?.price?.amount?.decimal) return;

      const newItems = [newListing, ...oldItems].sort((a, b) => {
        return b?.market?.floorAsk?.price?.amount?.decimal - a?.market?.floorAsk?.price?.amount?.decimal;
      });

      setItems(newItems);
    }
  }

  function addNewSale(tokenId) {
    const oldItems = itemRef.current;
    tokenId = tokenId?.toString();
    const newItems = oldItems.filter(item => item.token.tokenId !== tokenId);
    setItems(newItems);
  }

  useEffect(() => {
    if (
      (itemFilters.tokenId !== undefined && itemFilters.tokenId !== "") ||
      itemFilters.attributeFilter.length > 0 ||
      (itemFilters.sortBy !== "p-lth" && itemFilters.sortBy !== "p-htl")
    ) {
      setLiveItems(false);
    } else if (!liveItems) {
      setLiveItems(true);
    }
  }, [itemFilters, liveItems]);

  useEffect(() => {
    itemRef.current = items;
  }, [items]);

  useEffect(() => {
    address && fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemFilters, address]);

  async function checkIfWatchlist() {
    try {
      let res = await getWatchListCollections(address);
      setIsWatchList(res);
    } catch (e) {
      setIsWatchList(false);
    }
  }

  async function fetchMoreTokens() {
    try {
      setLoadingMoreItems(true);

      const { sortBy, tokenId } = itemFilters;
      let { min, max } = itemFilters.priceFilter;

      let attributeFilter = "";
      itemFilters.attributeFilter.forEach(attribute => {
        const { attributeKey, attributeValue } = attribute;
        attributeFilter += `-attributes[${attributeKey}]:${attributeValue}`;
      });

      if (!min && itemFilters.buyNowChecked) min = 0;

      let data = await fetch(
        `${baseUrl}/collectionItems/${address}?sortBy=${sortBy}&minAsk=${min}&maxAsk=${max}&attributes=${attributeFilter}&tokenId=${tokenId}&continuation=${tokensContinuation.current}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      if (!data.ok) throw new Error("Error");
      data = await data.json();

      const { tokens, continuation } = data;

      tokensContinuation.current = continuation;
      setItems(prev => [...prev, ...tokens]);
      setLoadingMoreItems(false);
    } catch (e) {
      console.log(e);
      tokensContinuation.current = false;
      setLoadingItems(false);
      setItems([]);
    }
  }
  async function fetchTokens() {
    try {
      setLoadingItems(true);

      const { sortBy, tokenId } = itemFilters;
      let { min, max } = itemFilters.priceFilter;

      let attributeFilter = "";
      itemFilters.attributeFilter.forEach(attribute => {
        const { attributeKey, attributeValue } = attribute;
        attributeFilter += `-attributes[${attributeKey}]:${attributeValue}`;
      });

      if (!min && itemFilters.buyNowChecked) min = 0;

      let data = await fetch(
        `${baseUrl}/collectionItems/${address}?sortBy=${sortBy}&minAsk=${min}&maxAsk=${max}&attributes=${attributeFilter}&tokenId=${tokenId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      if (!data.ok) throw new Error("Error");

      data = await data.json();

      const { tokens, continuation } = data;

      tokensContinuation.current = continuation;
      setItems(tokens);
      setLoadingItems(false);
    } catch (e) {
      console.log(e);
      tokensContinuation.current = false;
      setLoadingItems(false);
      setItems([]);
    }
  }

  async function getInfo() {
    try {
      setLoadingCollection(true);
      let res = await fetch(`${baseUrl}/collectionInfo/${address}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });
      if (!res.ok) throw new Error("Error");

      const { data, exists } = await res.json();

      if (!exists) navigate("notfound");

      const { name } = data;
      setPageTitle(`${name} | Wagmi Labs`);

      const openseContractDataApi = await fetch(`https://api.opensea.io/api/v1/asset_contract/${address}`);
      const openseContractData = await openseContractDataApi.json();
      const { slug } = openseContractData?.collection || data;

      const openseaDataApi = await fetch(`https://api.opensea.io/api/v1/collection/${slug}`);
      const openseaData = (await openseaDataApi.json())?.collection;

      const royalties =
        openseaData?.dev_seller_fee_basis_point ||
        openseContractData?.dev_seller_fee_basis_points ||
        data?.royalties?.bps ||
        "";
      const createdDate = openseaData?.created_date || openseContractData?.created_date;
      const marketCap = openseaData?.stats?.market_cap;
      const avgPrice = openseaData?.stats?.average_price;
      const owners = openseaData?.stats?.num_owners || openseContractData?.owner;
      const daySales = openseaData?.stats?.one_day_sales;
      const totalSales = openseaData?.stats?.total_sales;
      const ercType = openseContractData?.schema_name;

      data["collectionRoyalties"] = royalties;
      data["createdAt"] = createdDate;
      data["marketCap"] = marketCap;
      data["avgPrice"] = avgPrice;
      data["ownerCount"] = owners;
      data["oneDaySales"] = daySales;
      data["totalSales"] = totalSales;
      data["ercType"] = ercType;

      setCollectionInfo(data);
      setLoadingCollection(false);
    } catch (err) {
      setLoadingCollection(false);
      setCollectionInfo({});
    }
  }

  function expandDetails(e) {
    if (extra) {
      document.querySelector(".collection-info-boxes2").style.animation = "out 1.1s";
      setTimeout(() => setExtra(oldValue => !oldValue), 1000);
    } else {
      setExtra(oldValue => !oldValue);
    }
    document.querySelectorAll(".collection-info-box2").forEach(element => {
      element.classList.toggle("display-extra-info");
    });
    document.querySelector(".banner-image").classList.toggle("expand");
    e.target.classList.toggle("rotate");
  }

  function changeCollectionSection(e) {
    document.querySelectorAll(".single-collection-section").forEach(el => {
      el.classList.remove("selected");
    });
    e.currentTarget.classList.add("selected");

    const section = e.currentTarget.getAttribute("section");
    setSection(section);
  }

  // utility function

  const listingsItems = () => {
    const { onSaleCount, tokenCount } = collectionInfo;
    let data = "- - -";
    if (onSaleCount && tokenCount) {
      data = `${onSaleCount} / ${tokenCount} (${getPercentage(onSaleCount, tokenCount)}%)`;
    }
    return data;
  };

  const copyAddress = () => {
    copy(address);
    setCopyState({ value: "Copied" });
    setTimeout(() => {
      setCopyState({ value: "Copy" });
    }, 700);
  };

  const handleHoverCopy = hover => {
    const el = document.querySelector(".collection-address-copy-btn");
    if (hover) {
      el.classList.add("active");
      el.classList.remove("inactive");
    } else {
      setCopyState({ value: "Copy" });
      el.classList.remove("active");
      el.classList.add("inactive");
    }
  };

  const handleChangeWatchlist = async () => {
    try {
      if (isWatchList) {
        let res = await removeFromWatchList(address);
        if (res) setIsWatchList(false);
        else throw new Error("error");
      } else {
        let res = await addToWatchList(address);
        if (res) setIsWatchList(true);
        else throw new Error("error");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong, try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className="collection-info-container">
        <div className="banner-image" style={{ backgroundImage: `url(${collectionInfo.banner})` }}></div>
        <hr style={{ border: "1.5px solid grey", backgroundColor: "grey" }} />

        <div className="infos">
          {loadingCollection ? (
            <>
              <div className="collection-info-image">
                <Loader className={"collection-info-image-loader"} />
              </div>
              <div className="loading-texts">
                <div>
                  <Loader />
                </div>
                <div>
                  <Loader />
                </div>
                <div>
                  <Loader />
                </div>
              </div>
            </>
          ) : (
            <>
              <img className="collection-info-image" src={collectionInfo.image || placeholderImage} alt="" />
              <div className="collection-info-name">
                <div>{collectionInfo.name || "---"}</div>

                <span onClick={handleChangeWatchlist}>
                  {isWatchList ? (
                    <i className="fa-solid fa-star starWatchlist full"></i>
                  ) : (
                    <i className="fa-light fa-star starWatchlist"></i>
                  )}
                </span>
              </div>
              <div
                className="collection-address-copy"
                onClick={copyAddress}
                onMouseOver={() => handleHoverCopy(true)}
                onMouseOut={() => handleHoverCopy(false)}
              >
                <div>{formatContractAddress(address)}</div>
                <div className="collection-address-copy-btn inactive">{copyState.value}</div>
                <i className="fa-solid fa-clipboard"></i>
              </div>

              <div className="flex-normal">
                <div className="collection-info-royalties">
                  <i className="fa-solid fa-wallet"></i>
                  <div>{collectionInfo?.collectionRoyalties / 100}% Royalties</div>
                  <img style={{ width: "15px", marginLeft: "5px" }} src={opensea} alt="" />
                </div>
              </div>
            </>
          )}

          <div className="collection-info-description">
            <b>Collection description: </b>
            {loadingCollection ? (
              <Loader />
            ) : (
              <>
                <span className="low-opacity-text">
                  {collectionInfo.description || "There is no description available for this collection."}
                </span>
              </>
            )}
          </div>

          <div className="links">
            {
              <a href={`https://etherscan.io/address/${address}`} target={"_blank"} rel="noreferrer">
                <img src={etherscan} alt="" />
              </a>
            }
            {collectionInfo.slug && (
              <a href={`https://opensea.io/collection/${collectionInfo.slug}`} target={"_blank"} rel="noreferrer">
                <img src={opensea} alt="" />
              </a>
            )}
            {
              <a href={`https://x2y2.io/collection/${address}/items`} target={"_blank"} rel="noreferrer">
                <img src={x2y2} alt="" />
              </a>
            }
            {
              <a
                href={`https://looksrare.org/collections/${address}?queryID=2d673d7e77b4e27a2680a6d16a740a74`}
                target={"_blank"}
                rel="noreferrer"
              >
                <img src={looksRare} alt="" />
              </a>
            }
            {
              <a href={`https://www.gem.xyz/collection/${address}/`} target={"_blank"} rel="noreferrer">
                <img src={gem} alt="" />
              </a>
            }
            {collectionInfo.externalUrl && (
              <a href={`${collectionInfo.externalUrl}`} target={"_blank"} rel="noreferrer">
                <img src={www} alt="" />
              </a>
            )}
            {collectionInfo.twitterUsername && (
              <a href={`https://twitter.com/${collectionInfo.twitterUsername}`} target={"_blank"} rel="noreferrer">
                <img src={twitter} alt="" />
              </a>
            )}
            {collectionInfo.discordUrl && (
              <a href={`${collectionInfo.discordUrl}`} target={"_blank"} rel="noreferrer">
                <img src={discord} alt="" />
              </a>
            )}
          </div>

          {!loadingCollection && (
            <>
              <div className="collection-info-created-at">
                Creation date:
                <span className="low-opacity">
                  {" "}
                  {collectionInfo.createdAt ? formatTime(collectionInfo.createdAt) : "- - -"}
                </span>
              </div>

              <div className="collection-info-erc-type">
                <Badge colorScheme={"red"}>{collectionInfo?.ercType}</Badge>
              </div>
            </>
          )}
        </div>

        <div className="collection-info-boxes">
          <div className="collection-info-box">
            <p>Listings / Items</p>
            {loadingCollection ? (
              <Loader />
            ) : (
              <div>
                <p>{listingsItems()}</p>
              </div>
            )}
          </div>

          <div className="collection-info-box">
            <p>Floor price</p>
            {loadingCollection ? (
              <Loader />
            ) : (
              <div>
                <i className="fa-brands fa-ethereum"></i>
                <p>{roundPrice(collectionInfo.floorAsk?.price?.amount?.decimal) || "- - -"}</p>
                {collectionInfo?.floorAsk?.price && (
                  <img
                    src={getMarketplaceImage(collectionInfo?.floorAsk?.sourceDomain)}
                    className="collectioninfo-fp-image"
                    alt=""
                  />
                )}
              </div>
            )}
          </div>

          <div className="collection-info-box">
            <p>Owners</p>
            {loadingCollection ? (
              <Loader />
            ) : (
              <div>
                <p>{collectionInfo.ownerCount || "- - -"}</p>
              </div>
            )}
          </div>

          <div className="collection-info-box">
            <p>Sales (24h)</p>
            {loadingCollection ? (
              <Loader />
            ) : (
              <div>
                <p>{collectionInfo.oneDaySales || "- - -"}</p>
              </div>
            )}
          </div>

          <div className="collection-info-box2">
            <p>Volume (24h)</p>
            {loadingCollection ? (
              <Loader />
            ) : (
              <div>
                <i className="fa-brands fa-ethereum"></i>
                <p>{collectionInfo.volume ? roundPrice(collectionInfo.volume["1day"]) : "- - -"}</p>
              </div>
            )}
          </div>
        </div>

        {extra && (
          <div className="collection-info-boxes2">
            <div className="collection-info-box2">
              <p>Top bid</p>
              {loadingCollection ? (
                <Loader />
              ) : (
                <div>
                  <i className="fa-brands fa-ethereum"></i>
                  <p>{roundPrice(collectionInfo.topBid?.price?.amount?.decimal) || "- - -"}</p>
                  {collectionInfo?.topBid?.price && (
                    <img
                      src={getMarketplaceImage(collectionInfo?.topBid?.sourceDomain)}
                      className="collectioninfo-fp-image"
                      alt=""
                    />
                  )}
                </div>
              )}
            </div>

            <div className="collection-info-box2">
              <p>Market cap</p>
              {loadingCollection ? (
                <Loader />
              ) : (
                <div>
                  <i className="fa-brands fa-ethereum"></i>
                  <p>{collectionInfo.marketCap ? Math.round(collectionInfo.marketCap) : "- - -"}</p>
                </div>
              )}
            </div>

            <div className="collection-info-box2">
              <p>Average price</p>
              {loadingCollection ? (
                <Loader />
              ) : (
                <div>
                  <i className="fa-brands fa-ethereum"></i>
                  <p>{collectionInfo.avgPrice ? roundPrice(collectionInfo.avgPrice) : "- - -"}</p>
                </div>
              )}
            </div>

            <div className="collection-info-box">
              <p>Total volume</p>
              {loadingCollection ? (
                <Loader />
              ) : (
                <div>
                  <i className="fa-brands fa-ethereum"></i>
                  <p>{roundPrice(collectionInfo.volume?.allTime) || "- - -"}</p>
                </div>
              )}
            </div>

            <div className="collection-info-box2">
              <p>Total sales</p>
              {loadingCollection ? (
                <Loader />
              ) : (
                <div>
                  <p>{collectionInfo.totalSales || "- - -"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <i onClick={e => expandDetails(e)} className="fa-solid fa-chevron-down info-arrow"></i>
      </div>

      <div className="collection-sections">
        <div
          section="items"
          className="selected single-collection-section flex-15"
          onClick={e => changeCollectionSection(e)}
        >
          <p>Items</p>
          <LivePulsing notActive={!liveItems} />
        </div>
        <div section="liveview" onClick={e => changeCollectionSection(e)} className="single-collection-section flex-15">
          <p>Live view</p>
          <LivePulsing />
        </div>
        <div section="activity" onClick={e => changeCollectionSection(e)} className="single-collection-section">
          Activity
        </div>
        <div section="charts" onClick={e => changeCollectionSection(e)} className="single-collection-section">
          Charts
        </div>
        <div section="leaderboard" onClick={e => changeCollectionSection(e)} className="single-collection-section">
          Leaderboard
        </div>
      </div>

      {(() => {
        if (section === "items") {
          return (
            <Items
              loadingMoreItems={loadingMoreItems}
              fetchMoreTokens={fetchMoreTokens}
              tokensContinuation={tokensContinuation}
              address={address}
              items={items}
              setItems={setItems}
              itemFilters={itemFilters}
              setItemFilters={setItemFilters}
              loadingItems={loadingItems}
              setLoadingItems={setLoadingItems}
              buyNowChecked={buyNowChecked}
              setBuyNowChecked={setBuyNowChecked}
              collectionInfo={collectionInfo}
              searchText={searchText}
              setSearchText={setSearchText}
              debounceSearch={debounceSearch}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              options={options}
            />
          );
        } else if (section === "liveview") {
          return (
            <LiveView
              address={address}
              collectionInfo={collectionInfo}
              collectionImage={collectionInfo?.image}
              collectionName={collectionInfo?.name}
              floorPrice={collectionInfo.floorAsk?.price?.amount?.decimal}
            />
          );
        } else if (section === "activity") {
          return <Activity address={address} />;
        } else if (section === "charts") {
          return (
            <Charts
              collectionAddress={address}
              collectionSlug={collectionInfo?.slug}
              floorPrice={collectionInfo.floorAsk?.price?.amount?.decimal}
            />
          );
        } else if (section === "leaderboard") {
          return <Leaderboard address={address} />;
        }
      })()}
    </>
  );
};

const Loader = ({ className }) => {
  let borderRadius = "6px";
  if (className === "collection-info-image-loader") borderRadius = "50%";

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#4444" borderRadius={borderRadius}>
      <Skeleton count={1} children={Box} className={className} />
    </SkeletonTheme>
  );
};

const Box = ({ children }) => {
  return <span style={{ marginTop: "10px" }}>{children}</span>;
};

export default Collection;
