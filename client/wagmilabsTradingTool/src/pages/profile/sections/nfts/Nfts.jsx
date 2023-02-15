import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { baseUrl } from "@Variables";
import { Portal } from "react-portal";

import notFoundNft from "@Assets/question.png";

// import { useAccount } from 'wagmi'

import moment from "moment";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./nfts.css";

import notFound from "@Assets/notFound.svg";

import {
  getListingExpirationDate,
  roundPrice,
  roundPrice2,
} from "@Utils/formats/formats";
import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { UserDataContext } from "@Context/userContext";
import { Loader } from "@Components";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { useNavigate } from "react-router-dom";
import { useListNft } from "@Hooks";

const sortItemsOptions = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

const Nfts = ({
  loadingMoreNfts,
  fetchMoreItems,
  nftsContinuation,
  nftsCollectionFilter,
  setNftsCollectionFilter,
  searchCollectionText,
  userItems,
  setProfileImage,
  collections,
  loadingNfts,
  listingSettings,
  selectedSortOption,
  setSelectedSortOption,
  setSearchCollectionText,
}) => {
  const { cryptoPrices } = useContext(UserDataContext);
  const toast = useToast();

  const navigate = useNavigate();

  const [quickListData, setQuickListData] = useState({});
  const [showQuickListingModal, setShowQuickListingModal] = useState(false);

  const [selectBulk, setSelectBulk] = useState(false);
  const [bulkItems, setBulkItems] = useState([]);

  const [showSortItemsOptions, setShowSortItemsOptions] = useState(false);

  const observer = useRef(false);

  useEffect(() => {
    const handleClick = event => {
      const path = event.composedPath();
      const el1 = document.querySelector(".profile-sort-items");
      const el2 = "item-option-button";
      const el3 = document.querySelector(".profile-filter-collection");

      if (!path.includes(el3)) {
        closeCollectionDropdown();
      }

      if (!path.includes(el1)) {
        setShowSortItemsOptions(false);
      }

      const classLists = Array.from(event.target.classList);
      if (!classLists.includes(el2)) {
        closeAllOptions();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nftsContinuation.current) {
        // alert("hello")
        fetchMoreItems();
      }
    }, options);

    const target = document.querySelector(".single-item-container.last-token");
    if (target) {
      observer.current.observe(target);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userItems]);

  useEffect(() => {
    if (!selectBulk) {
      setBulkItems([]);
    }
  }, [selectBulk]);

  const handleFilterCollection = (collectionAddress, e) => {
    if (
      collectionAddress?.toLowerCase() === nftsCollectionFilter?.toLowerCase()
    ) {
      setNftsCollectionFilter("");
    } else {
      setNftsCollectionFilter(collectionAddress);
    }
  };

  function toggleCollectionDropdown(e) {
    const profileCollectionArrow = document.querySelector(
      ".profile-collection-arrow"
    );
    const collectionDropdown = document.querySelector(".collection-dropdown");

    if (e.target !== profileCollectionArrow && e.target !== e.currentTarget) {
      return;
    }

    profileCollectionArrow.classList.toggle("selected");
    collectionDropdown.classList.toggle("invisible");
  }

  function closeCollectionDropdown() {
    document
      .querySelector(".profile-collection-arrow")
      .classList.remove("selected");
    document.querySelector(".collection-dropdown").classList.add("invisible");
  }

  const activateList = index => {
    document
      .querySelectorAll(".profile-list-nft")
      [index].classList.remove("inactive");
    document
      .querySelectorAll(".profile-list-nft")
      [index].classList.add("active");
  };

  const deactivateList = index => {
    document
      .querySelectorAll(".profile-list-nft")
      [index].classList.remove("active");
    document
      .querySelectorAll(".profile-list-nft")
      [index].classList.add("inactive");
  };

  const toggleOptions = index => {
    const element = document.querySelectorAll(".single-nft-options")[index];
    if (element.classList.contains("invisible")) {
      closeAllOptions();
      element.classList.toggle("invisible");
    } else {
      element.classList.toggle("invisible");
      closeAllOptions();
    }
  };

  const closeAllOptions = () => {
    document
      .querySelectorAll(".single-nft-options")
      .forEach(el => el.classList.add("invisible"));
  };

  const changeBulk = state => {
    setSelectBulk(state);
  };

  const changeBulkItems = (contractAddress, tokenId, id, e) => {
    const container = e.target.parentNode.parentNode;

    let contains = false;
    bulkItems.forEach(item => {
      if (item.id === id) contains = true;
    });

    if (contains) {
      const filteredBulks = bulkItems.filter(item => item.id !== id);
      container.classList.remove("profile-single-item-bulk-selected");
      setBulkItems(filteredBulks);
    } else {
      container.classList.add("profile-single-item-bulk-selected");
      setBulkItems(prev => [...prev, { contractAddress, tokenId, id }]);
    }
  };

  const selectAllBulkItems = () => {
    userItems.forEach((item, index) => {
      const contractAddress = item?.token?.contract;
      const tokenId = item?.token?.tokenId;

      const id = contractAddress + tokenId;
      const e = {
        target: document.querySelectorAll(".profile-single-item-image")[index],
      };

      changeBulkItems(contractAddress, tokenId, id, e);
    });
  };
  const clearAllBulkItems = () => {
    setBulkItems([]);
    document
      .querySelectorAll(".profile-single-item-bulk-selected")
      .forEach(el => el.classList.remove("profile-single-item-bulk-selected"));
  };

  const toggleSortOptions = () => {
    setShowSortItemsOptions(old => !old);
  };

  function openSmartListingModal(tokenId, contractAddress, floorPrice) {
    document.body.style.overflow = "hidden";
    setShowQuickListingModal(true);
    setQuickListData({ tokenId, contractAddress, floorPrice });
  }

  function closeSmartListingModal() {
    document.body.style.overflow = "unset";
    setShowQuickListingModal(false);
    setQuickListData({});
  }

  const { listNft } = useListNft(quickListData, () => {
    closeSmartListingModal();
  });

  async function updateUserImage(image) {
    try {
      let res = await fetch(`${baseUrl}/setUserImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
        body: JSON.stringify({ image_url: image }),
      });

      if (res.status !== 200) throw new Error("Error updating user image");

      res = await res.json();

      const { imageUrl: newImage } = res;

      setProfileImage(newImage);
      toast({
        title: "Profile image updated.",
        description: "You're profile image has succesfully been changed.",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error changing profile image.",
        description:
          "There has been an error while trying to update your profile image, try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const itemMapping = useMemo(
    () =>
      userItems?.map((item, index) => {
        let image = item?.token?.image || notFoundNft;
        let name = item?.token?.name;

        const marketplace = item?.ownership?.floorAsk?.source?.name;
        const marketplaceImage = marketplace
          ? getMarketplaceImage(marketplace)
          : "";
        const price = item?.ownership?.floorAsk?.price?.amount?.decimal;

        const { rarityRank } = item?.token;

        const contractAddress = item?.token?.contract;
        const tokenId = item?.token?.tokenId;

        const collectionImage = item?.token?.collection?.imageUrl;
        const collectionName = item?.token?.collection?.name;
        const floor_price = item?.token?.collection?.floorAskPrice;

        const isLast = index === userItems.length - 1;

        const id = contractAddress + tokenId;

        return (
          <div
            className={`single-item-container ${isLast && "last-token"}`}
            key={id}
            onMouseOver={() => activateList(index)}
            onMouseOut={() => deactivateList(index)}
          >
            <div
              className={`${
                selectBulk
                  ? "profile-items-details-container-bulk"
                  : "profile-items-details-container"
              }`}
            >
              <div className="image-hover-overflow">
                <img
                  src={image}
                  alt=""
                  className={`profile-single-item-image ${
                    selectBulk ? "single-item-image" : "single-item-image-scale"
                  }`}
                  onClick={e =>
                    selectBulk
                      ? changeBulkItems(contractAddress, tokenId, id, e)
                      : navigate(`/item/${contractAddress}/${tokenId}`)
                  }
                />
                {rarityRank && (
                  <div className="profile-items-rarity-box">
                    <p># {rarityRank}</p>
                  </div>
                )}

                {marketplace && (
                  <div className="profile-items-listing-box">
                    <img src={marketplaceImage} alt="" />
                    <p>{roundPrice2(price)}</p>
                  </div>
                )}
              </div>

              <div
                className="option-button"
                onClick={() => toggleOptions(index)}
              >
                <i className="fa-regular fa-ellipsis item-option-button"></i>

                <div className="single-nft-options invisible">
                  <div onClick={() => updateUserImage(image)}>
                    <i className="fa-solid fa-image"></i>
                    <p>Set as PFP</p>
                  </div>
                  <div>
                    <i className="fa-solid fa-arrow-up"></i>
                    <p>Transfer</p>
                  </div>
                </div>
              </div>

              {/* <img src={optionButton} className="option-button" onMouseOver={(e)=> uploadInfo(e)} onMouseOut={e=> removeInfo(e)} onClick={updateUserImage}/> */}
              <a
                href={`/collection/${contractAddress}`}
                rel="noreferrer"
                target="_blank"
              >
                <Tooltip
                  hasArrow
                  label={collectionName}
                  fontSize="xs"
                  bg="black"
                  color={"white"}
                  placement="top"
                  borderRadius={"7px"}
                >
                  <img
                    src={collectionImage}
                    alt=""
                    className="profile-item-collection-image"
                  />
                </Tooltip>
              </a>
              <div className="profile-item-stats">
                <div className="profile-item-name-stats">
                  <p className="single-item-name">{name || tokenId}</p>
                  {/* <p className='single-item-collection-name'>{collectionName}</p> */}
                  <p className="single-item-rarity">
                    Floor price: {floor_price && roundPrice(floor_price)} ETH
                  </p>
                </div>
                <hr></hr>
                {/* getListingInfo(tokenId, contractAddress, floor_price) */}
                <div
                  className="profile-list-nft inactive"
                  onClick={() =>
                    openSmartListingModal(tokenId, contractAddress, floor_price)
                  }
                >
                  <i className="fa-solid fa-tag"></i>
                  <span>Smart list</span>
                </div>
              </div>
            </div>
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userItems, bulkItems, selectBulk]
  );

  return (
    <>
      {showQuickListingModal && (
        <SmartListModal
          quickListData={quickListData}
          listingSettings={listingSettings}
          listNft={listNft}
          closeSmartListingModal={closeSmartListingModal}
          ethPrice={cryptoPrices?.ethPrice}
          setQuickListData={setQuickListData}
          toast={toast}
        />
      )}

      <div className="profile-token-filters">
        <div className="profile-sort-items-container">
          <div className="profile-sort-items" onClick={toggleSortOptions}>
            <div className="profile-sort-items-option">
              {selectedSortOption.label}
              <i
                className={`fa-solid fa-caret-down profile-collection-sort-arrow ${
                  showSortItemsOptions && "selected"
                }`}
              ></i>
            </div>

            {showSortItemsOptions && (
              <div className="profile-sort-items-options">
                {sortItemsOptions.map(option => (
                  <div
                    key={option.value}
                    className="profile-sort-item-single-option"
                    onClick={() => setSelectedSortOption(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="profile-filters">
          <div
            className="profile-filter-collection"
            onClick={e => toggleCollectionDropdown(e)}
          >
            {nftsCollectionFilter?.length > 0 && (
              <p className="collection-filter-indicator">1</p>
            )}
            Collection{" "}
            <i className="fa-solid fa-caret-down profile-collection-arrow"></i>
            <div className="collection-dropdown invisible">
              {collections && (
                <div className="collection-dropdown-search">
                  <i className="fa-solid fa-magnifying-glass lens"></i>
                  <input
                    type="text"
                    className="collection-dropdown-search"
                    placeholder="Search"
                    value={searchCollectionText}
                    onChange={e => setSearchCollectionText(e.target.value)}
                  />
                </div>
              )}
              {collections ? (
                collections.length > 0 ? (
                  collections.map((collection, index) => {
                    const image = collection?.image_url;
                    const name = collection?.name;
                    const address = collection?.contract_address;

                    return (
                      <div
                        className={`single-collection-dropdown ${
                          address === nftsCollectionFilter && "selected"
                        }`}
                        key={index}
                        active="false"
                        onClick={e => handleFilterCollection(address, e)}
                      >
                        <div className="single-collection-dropdown-nameimage">
                          <img src={image} alt="" />
                          <div>{name}</div>
                        </div>
                        <i className="fa-solid fa-check single-collection-dropdown-check inactive"></i>
                      </div>
                    );
                  })
                ) : (
                  <div className="collection-dropdown-notfound">
                    No collection found.
                  </div>
                )
              ) : (
                <div className="collection-dropdown-notfound">
                  Loading collections...
                </div>
              )}
            </div>
          </div>

          {selectBulk ? (
            <div
              className="profile-item-bulk-list-transfer-cancel"
              onClick={() => changeBulk(false)}
            >
              Cancel
            </div>
          ) : (
            <div
              className="profile-item-bulk-list-transfer"
              onClick={() => changeBulk(true)}
            >
              Bulk list / transfer
            </div>
          )}
        </div>
      </div>

      {loadingNfts ? (
        <div className="profile-items-container">
          <div className="profile-skeleton-container">
            <SkeletonTheme
              baseColor="#202020"
              highlightColor="#444"
              height={"327px"}
              borderRadius={"10px"}
            >
              <p>
                <Skeleton count={14} wrapper={Box} />
              </p>
            </SkeletonTheme>
          </div>
        </div>
      ) : (
        <div className="profile-items-container">
          {selectBulk && (
            <>
              <div className="nfts-bulk-information-container">
                <div>{bulkItems.length} item selected</div>

                <div className="nfts-bulk-information-buttons">
                  {bulkItems.length > 0 ? (
                    <button
                      className="nfts-bulk-information-clear-button"
                      onClick={clearAllBulkItems}
                    >
                      Clear All
                    </button>
                  ) : (
                    <button
                      className="nfts-bulk-information-select-button"
                      onClick={selectAllBulkItems}
                    >
                      Select All
                    </button>
                  )}
                  <button className="nfts-bulk-information-list-button">
                    List
                  </button>
                  <button className="nfts-bulk-information-transfer-button">
                    Transfer
                  </button>
                </div>
              </div>
              <hr className="nfts-bulk-information-hr" />
            </>
          )}

          {userItems.length === 0 ? (
            <div className="profile-user-no-items">
              <img src={notFound} alt="" />
              <p>No NFTs found.</p>
            </div>
          ) : (
            <div className="profile-items">
              {itemMapping}

              {loadingMoreNfts &&
                [...Array(18)].map(i => {
                  return (
                    <SkeletonTheme
                      baseColor="#202020"
                      highlightColor="#444"
                      height={"327px"}
                      borderRadius={"10px"}
                    >
                      <p>
                        <Skeleton count={1} wrapper={Box} />
                      </p>
                    </SkeletonTheme>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Box = ({ children }) => {
  return <span>{children}</span>;
};

const SmartListModal = ({
  quickListData,
  listingSettings,
  listNft,
  closeSmartListingModal,
  ethPrice,
  setQuickListData,
  toast,
}) => {
  const [loadingData, setLoadingData] = useState(true);
  const [confirmingList, setConfirmingList] = useState(false);

  useEffect(() => {
    getTokenData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getTokenData() {
    try {
      setLoadingData(true);

      const { profitType, profitValue, type } = listingSettings?.price;

      let listingType = "";
      if (type === "profit")
        listingType = `${type}-${profitValue}-${profitType}`;
      else if (type === "break-even") listingType = type;

      const { tokenId, contractAddress } = quickListData;
      const { marketplace } = listingSettings;

      let res = await fetch(
        `${baseUrl}/tokenListPrice?tokenId=${tokenId}&contractAddress=${contractAddress}&marketplace=${marketplace}&listingType=${listingType}&ethPrice=${ethPrice}`,
        {
          headers: {
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      if (!res.ok)
        throw new Error(
          "Something went wrong while fetching listing price. Please try again."
        );

      res = await res.json();

      const { listingPrice } = res;

      setQuickListData(prev => ({ ...prev, listingPrice }));
      setLoadingData(false);
    } catch (e) {
      toast({
        title: "Error",
        description:
          "Something went wrong while fetching listing price. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setQuickListData({});
      closeSmartListingModal();
      setLoadingData(false);
    }
  }

  return (
    <>
      <Portal>
        <div className="bg-modal"></div>

        <div className="nft-listing-modal">
          <button
            className="smart-list-close-modal"
            onClick={closeSmartListingModal}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {loadingData ? (
            <SkeletonTheme
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              borderRadius={"10px"}
            >
              <Skeleton count={1} />
            </SkeletonTheme>
          ) : (
            <div className="smart-list-modal-container">
              <p>
                You are going to list your NFT at {quickListData?.listingPrice}{" "}
                on {listingSettings?.marketplace?.toUpperCase()}
              </p>

              <p>Collection floor price: {quickListData?.floorPrice}</p>

              <p>
                Listing will expire:{" "}
                {moment(getListingExpirationDate(listingSettings)).format(
                  "DD/MM/YYYY hh:mm A"
                )}
              </p>

              <Button
                onClick={() => !confirmingList && listNft(setConfirmingList)}
              >
                {confirmingList ? (
                  <Loader width={"20px"} height={"20px"} />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          )}
        </div>
      </Portal>
    </>
  );
};
export default Nfts;
