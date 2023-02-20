import React, { useEffect, useMemo, useState, useRef } from "react";
import "./activity.css";
import { placeholderImage } from "@Assets";
import {
  formatAddress2,
  roundPrice2,
  formatIpfs,
} from "@Utils/formats/formats";
import { baseUrl } from "@Variables";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import moment from "moment";
import { useAccount } from "wagmi";
import {
  Button,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const activityTypeMapping = {
  list: "List",
  sale: "Sale",
  buy: "Buy",
  receive: "Receive",
  send: "Send",
  mint: "Mint",
};

const activityMarketplaceMapping = [
  {
    name: "All",
    value: "",
  },
  {
    name: "OpenSea",
    value: "opensea",
  },
  {
    name: "X2Y2",
    value: "x2y2",
  },
  {
    name: "SudoSwap",
    value: "sudoswap",
  },
  {
    name: "LooksRare",
    value: "looksrare",
  },
  {
    name: "Blur",
    value: "blur",
  },
  {
    name: "Rarible",
    value: "rarible",
  },
];

const Activity = () => {
  const { address: userAdress } = useAccount();

  const [activityCategory, setActivityCategory] = useState(["sale"]);
  const [activityAddressFilter, setActivityAddressFilter] = useState({
    from: "",
    to: "",
  });
  const [activityPriceFilter, setActivityPriceFilter] = useState({
    min: "",
    max: "",
  });
  const [activityMarketplaceFilter, setActivityMarketplaceFilter] =
    useState("");
  const [activityTokenIdFilter, setActivityTokenIdFilter] = useState("");
  const [activityContractAddressFilter, setActivityContractAddressFilter] =
    useState("");

  const [profileActivity, setProfileActivity] = useState([]);
  const [profileActivityLoading, setProfileActivityLoading] = useState(true);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [activityOffsets, setActivityOffsets] = useState({ 0: 0, 1: 0, 2: 0 });
  const [profileActivityLoadMore, setProfileActivityLoadMore] = useState(false);

  const hasMoreActivityRef = useRef(false);

  const observer = useRef(null);

  const [activityFilters, setActivityFilters] = useState({
    activityCategory,
    activityAddressFilter,
    activityPriceFilter,
    activityMarketplaceFilter,
    activityTokenIdFilter,
    activityContractAddressFilter,
    dateRange,
  });

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFilters]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreActivityRef.current) {
        loadMoreActivity();
      }
    }, options);

    const target = document.querySelector(
      ".profile-activity-single-container.last-token"
    );
    if (target) {
      observer.current.observe(target);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileActivity]);

  const getAddressFilter = () => {
    const { activityAddressFilter } = activityFilters;
    const { from, to } = activityAddressFilter;

    let addressFilter = "";

    if (from && to) {
      addressFilter = `&fromAddress=${from}&toAddress=${to}`;
    } else if (from && !to) {
      addressFilter = `&fromAddress=${from}`;
    } else if (!from && to) {
      addressFilter = `&toAddress=${to}`;
    } else {
      addressFilter = "";
    }

    return addressFilter;
  };
  const getTypeFilter = () => {
    const { activityCategory } = activityFilters;
    let typeUrl = "";

    activityCategory.forEach(item => {
      typeUrl =
        typeUrl + `&include${item[0].toUpperCase()}${item.slice(1)}=true`;
    });
    return typeUrl;
  };
  const getPriceFilter = () => {
    const { activityPriceFilter } = activityFilters;
    const { min, max } = activityPriceFilter;

    let priceFilter = "";

    if (min && max) {
      priceFilter = `&minPrice=${min}&maxPrice=${max}`;
    } else if (min && !max) {
      priceFilter = `&minPrice=${min}`;
    } else if (!min && max) {
      priceFilter = `&maxPrice=${max}`;
    } else {
      priceFilter = "";
    }

    return priceFilter;
  };
  const getMarketplaceFilter = () => {
    const { activityMarketplaceFilter } = activityFilters;
    const marketplaceFilter = activityMarketplaceFilter
      ? `&marketplace=${activityMarketplaceFilter}`
      : "";
    return marketplaceFilter;
  };
  const getTokenIdFilter = () => {
    const { activityTokenIdFilter } = activityFilters;
    const tokenIdFilter = activityTokenIdFilter
      ? `&tokenId=${activityTokenIdFilter}`
      : "";
    return tokenIdFilter;
  };
  const getContractFilter = () => {
    const { activityContractAddressFilter } = activityFilters;
    const contractFilter = activityContractAddressFilter
      ? `&contractAddress=${activityContractAddressFilter}`
      : "";
    return contractFilter;
  };
  const getDateFilter = () => {
    const { dateRange } = activityFilters;
    const [startDate, endDate] = dateRange;

    let dateFilter = "";

    if (startDate && endDate) {
      dateFilter = `&startDate=${new Date(
        startDate
      ).getTime()}&endDate=${new Date(endDate).getTime()}`;
    } else if (startDate && !endDate) {
      dateFilter = `&startDate=${new Date(startDate).getTime()}`;
    } else if (!startDate && endDate) {
      dateFilter = `&endDate=${new Date(endDate).getTime()}`;
    }

    return dateFilter;
  };
  const getActivityOffsets = () => {
    let offset = "";

    Object.keys(activityOffsets).forEach(key => {
      offset = offset + `&offset${key}=${activityOffsets[key]}`;
    });

    return offset;
  };

  async function loadMoreActivity() {
    try {
      setProfileActivityLoadMore(true);

      const addressFilter = getAddressFilter();
      const typeFilter = getTypeFilter();
      const priceFilter = getPriceFilter();
      const marketplaceFilter = getMarketplaceFilter();
      const tokenIdFilter = getTokenIdFilter();
      const contractFilter = getContractFilter();
      const dateFilter = getDateFilter();

      const offsetFilters = getActivityOffsets();

      const response = await fetch(
        `${baseUrl}/profileActivity?hello=hello${typeFilter}${addressFilter}${priceFilter}${marketplaceFilter}${tokenIdFilter}${contractFilter}${dateFilter}${offsetFilters}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      if (!response.ok) throw new Error("Error loading activity");

      const { activity, newOffset1, newOffset2, newOffset3, hasMoreActivity } =
        await response.json();
      hasMoreActivityRef.current = hasMoreActivity;
      setActivityOffsets({ 1: newOffset1, 2: newOffset2, 3: newOffset3 });
      setProfileActivity(old => [...old, ...activity]);
    } catch (e) {
      console.log(e);
      hasMoreActivityRef.current = false;
      setProfileActivity([]);
    } finally {
      setProfileActivityLoadMore(false);
    }
  }
  async function fetchActivity() {
    try {
      setProfileActivityLoading(true);

      const addressFilter = getAddressFilter();
      const typeFilter = getTypeFilter();
      const priceFilter = getPriceFilter();
      const marketplaceFilter = getMarketplaceFilter();
      const tokenIdFilter = getTokenIdFilter();
      const contractFilter = getContractFilter();
      const dateFilter = getDateFilter();

      const response = await fetch(
        `${baseUrl}/profileActivity?hello=hello${typeFilter}${addressFilter}${priceFilter}${marketplaceFilter}${tokenIdFilter}${contractFilter}${dateFilter}&offset1=0&offset2=0&offset3=0`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      if (!response.ok) throw new Error("Error loading activity");

      const { activity, newOffset1, newOffset2, newOffset3, hasMoreActivity } =
        await response.json();
      hasMoreActivityRef.current = hasMoreActivity;
      setActivityOffsets({ 1: newOffset1, 2: newOffset2, 3: newOffset3 });
      setProfileActivity(activity);
    } catch (e) {
      console.error(e);
      hasMoreActivityRef.current = false;
      setProfileActivity([]);
    } finally {
      setProfileActivityLoading(false);
    }
  }

  function changeActivityCategory(filter) {
    if (activityCategory.includes(filter)) {
      const newActivityFilter = activityCategory.filter(
        item => item !== filter
      );
      setActivityCategory(newActivityFilter);
    } else {
      const newActivityFilter = [...activityCategory, filter];
      setActivityCategory(newActivityFilter);
    }
  }

  function saveActivityFilters() {
    const activityOffsets = { 0: 0, 1: 0, 2: 0 };

    setActivityFilters({
      activityCategory,
      activityAddressFilter,
      activityPriceFilter,
      activityMarketplaceFilter,
      activityTokenIdFilter,
      activityContractAddressFilter,
      dateRange,
      activityOffsets,
    });
  }

  const profileActivityMapping = useMemo(
    () =>
      profileActivity.map((item, index) => {
        const {
          type,
          from_address,
          marketplace,
          price,
          createdAt,
          to_address,
          token_id,
          transaction_hash,
        } = item || {};

        const contractAddress = item?.contractAddress || item.contract_address;
        let { name: tokenName, image: tokenImage } =
          item?.tokenData?.token || {};
        const { name: collectionName } =
          item?.tokenData?.token?.collection || {};
        // const {tokenName, tokenImage, tokenId} = item.token
        // const {collectionName, collectionImage} = item.collection

        const activityType = activityTypeMapping[type];

        const marketplaceImage = getMarketplaceImage(marketplace);

        const key = crypto.randomUUID();

        if (tokenImage?.includes("ipfs")) tokenImage = formatIpfs(tokenImage);
        const isLast = index === profileActivity.length - 1;

        return (
          <>
            <tr
              key={key}
              className={`profile-activity-single-container ${isLast && "last-token"
                }`}
            >
              <td className="profile-activity-single-type">
                <div className="profile-activity-marketplace-container">
                  {marketplaceImage ? (
                    <img
                      src={marketplaceImage}
                      className="profile-activity-marketplace-image"
                      alt=""
                    />
                  ) : (
                    <ActivityIcon type={type} />
                  )}
                  {activityType}
                </div>
              </td>

              <a href={`/item/${contractAddress}/${token_id}`}>
                <td className="profile-activity-single-token">
                  <img
                    src={tokenImage || placeholderImage}
                    alt=""
                    className="profile-activity-single-image"
                  />
                  <div className="wrap-text">
                    <p className="wrap-text">{tokenName || token_id}</p>
                    <p className="low-opacity little-text wrap-text">
                      {collectionName}
                    </p>
                  </div>
                </td>
              </a>
              <td className="profile-activity-single-price">
                {price ? roundPrice2(price) : 0} ETH
              </td>
              <td className="profile-activity-single-from">
                {to_address
                  ? formatAddress2(to_address, userAdress)
                  : "- - -"}
              </td>
              <td className="profile-activity-single-to">
                {from_address ? formatAddress2(from_address, userAdress) : "- - -"}
              </td>
              <td className="profile-activity-single-time">
                <a
                  href={`${type !== "list"
                      ? `https://etherscan.io/tx/${transaction_hash}`
                      : ""
                    }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={`${type !== "list" && "activity"}`}>
                    {moment(createdAt).fromNow()}
                    {type !== "list" && (
                      <i className="fa-sharp fa-solid fa-up-right-from-square"></i>
                    )}
                  </div>
                </a>
              </td>
            </tr>

            <tr className="profile-activity-single-hr">
              <td colSpan={6}>
                <hr></hr>
              </td>
            </tr>
          </>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profileActivity]
  );

  return (
    <>
      <hr className="profile-activity-hr" />
      <div className="profile-activity-section">
        <div className="profile-activity-filters-container">
          <div className="profile-activity-filter-section">
            <p>CATEGORY</p>

            <div className="profile-activity-filters-categories">
              <div
                onClick={() => changeActivityCategory("sale")}
                className={`${activityCategory.includes("sale") ? "active" : ""
                  }`}
              >
                <i className="fa-light fa-bag-shopping"></i>
                Sales
              </div>
              <div
                onClick={() => changeActivityCategory("list")}
                className={`${activityCategory.includes("list") ? "active" : ""
                  }`}
              >
                <i className="fa-light fa-tag"></i>
                Listings
              </div>
            </div>
            <div className="profile-activity-filters-categories">
              <div
                onClick={() => changeActivityCategory("mint")}
                className={`${activityCategory.includes("mint") ? "active" : ""
                  }`}
              >
                <i className="fa-solid fa-sparkles"></i>
                Mints
              </div>
              <div
                onClick={() => changeActivityCategory("send")}
                className={`${activityCategory.includes("send") ? "active" : ""
                  }`}
              >
                <i className="fa-regular fa-plane-departure"></i>
                Send
              </div>
            </div>
            <div className="profile-activity-filters-categories">
              <div
                onClick={() => changeActivityCategory("receive")}
                className={`${activityCategory.includes("receive") ? "active" : ""
                  }`}
              >
                <i className="fa-light fa-truck"></i>
                Receive
              </div>
              <div
                onClick={() => changeActivityCategory("burn")}
                className={`${activityCategory.includes("burn") ? "active" : ""
                  }`}
              >
                <i className="fa-solid fa-fire"></i>
                Burn
              </div>
            </div>
            <div className="profile-activity-filters-categories">
              <div
                onClick={() => changeActivityCategory("buy")}
                className={`${activityCategory.includes("buy") ? "active" : ""
                  }`}
              >
                <i className="fa-light fa-truck"></i>
                Buy
              </div>
            </div>
          </div>

          <div className="profile-activity-filter-section">
            <p>DATE</p>

            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={update => {
                setDateRange(update);
              }}
              isClearable={true}
              placeholderText="Select date"
              className="profile-activity-date-picker"
            />
          </div>

          <div className="profile-activity-filter-section">
            <p>ADDRESSES</p>

            <HStack>
              <Input
                placeholder="From"
                value={activityAddressFilter.from}
                onChange={e =>
                  setActivityAddressFilter(old => ({
                    ...old,
                    from: e.target.value,
                  }))
                }
              ></Input>
              <Input
                placeholder="To"
                value={activityAddressFilter.to}
                onChange={e =>
                  setActivityAddressFilter(old => ({
                    ...old,
                    to: e.target.value,
                  }))
                }
              ></Input>
            </HStack>
          </div>

          <div className="profile-activity-filter-section">
            <p>PRICE</p>

            <HStack>
              <NumberInput
                value={activityPriceFilter.min}
                onChange={value =>
                  setActivityPriceFilter(old => ({ ...old, min: value }))
                }
              >
                <HStack>
                  <NumberInputField placeholder="Min" />
                </HStack>
              </NumberInput>

              <NumberInput
                value={activityPriceFilter.max}
                onChange={value =>
                  setActivityPriceFilter(old => ({ ...old, max: value }))
                }
              >
                <HStack>
                  <NumberInputField placeholder="Max" />
                </HStack>
              </NumberInput>
            </HStack>
          </div>

          <div className="profile-activity-filter-section">
            <p>COLLECTION</p>
            <HStack>
              <Input
                placeholder="Collection address"
                onChange={e => setActivityContractAddressFilter(e.target.value)}
              />
            </HStack>
          </div>

          <div className="profile-activity-filter-section">
            <p>MARKETPLACE</p>

            <Select
              value={activityMarketplaceFilter}
              onChange={e => setActivityMarketplaceFilter(e.target.value)}
            >
              {activityMarketplaceMapping.map((marketplace, index) => (
                <option key={index} value={marketplace.value}>
                  {marketplace.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="profile-activity-filter-section">
            <p>TOKEN ID</p>

            <NumberInput
              value={activityTokenIdFilter}
              onChange={value => setActivityTokenIdFilter(value)}
            >
              <HStack>
                <NumberInputField placeholder="TokenId" />
              </HStack>
            </NumberInput>
          </div>

          <div className="profile-activity-filter-section">
            <Button width={"100%"} onClick={saveActivityFilters}>
              Save
            </Button>
          </div>
        </div>

        <div className="profile-activity-container">
          <div className="profile-activity-table-container">
            <table className="profile-activity-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th className="profile-activity-tr-item">Item</th>
                  <th>Price</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {profileActivityLoading && (
                  <tr>
                    <td colSpan={6}>
                      <div className="loading">
                        Loading activity{" "}
                        <svg
                          className="spinner"
                          width="65px"
                          height="65px"
                          viewBox="0 0 66 66"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="path"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="33"
                            cy="33"
                            r="30"
                          ></circle>
                        </svg>{" "}
                      </div>
                    </td>
                  </tr>
                )}
                {!profileActivityLoading && profileActivityMapping}
                {profileActivityLoadMore && (
                  <tr>
                    <td colSpan={6}>
                      <div className="loading">
                        Loading more activity{" "}
                        <svg
                          className="spinner"
                          width="65px"
                          height="65px"
                          viewBox="0 0 66 66"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="path"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            cx="33"
                            cy="33"
                            r="30"
                          ></circle>
                        </svg>{" "}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;

const ActivityIcon = ({ type }) => {
  return (
    <>
      {(() => {
        switch (type) {
          case "sale":
            return <i className="fa-light fa-bag-shopping"></i>;
          case "buy":
            return <i className="fa-light fa-bag-shopping"></i>;
          case "list":
            return <i className="fa-light fa-tag"></i>;
          case "receive":
            return <i className="fa-light fa-truck"></i>;
          case "send":
            return <i className="fa-light fa-truck"></i>;
          case "mint":
            return <i className="fa-solid fa-sparkles"></i>;
          case "burn":
            return <i className="fa-solid fa-fire"></i>;
          default:
            return <i className="fa-solid fa-question"></i>;
        }
      })()}
    </>
  );
};
