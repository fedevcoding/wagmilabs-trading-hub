import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import "./items.css";

import _ from "lodash";
import {
  NumberInput,
  NumberInputField,
  Button,
  HStack,
  Switch,
  Checkbox,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  Box,
  AccordionPanel,
  Divider,
  Input,
  InputGroup,
  Tooltip,
} from "@chakra-ui/react";

import { UserDataContext } from "@Context/userContext";
import { roundPrice } from "@Utils/formats/formats";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";

import flaggedImg from "@Assets/flagged.svg";
import { BuyNowModal, Row } from "@Components";
import {
  useAddItemToCart,
  useBuyNow,
  useGetBuyNowModalFunctions,
  useRemoveItemFromCart,
  useFirstRender,
} from "@Hooks";
import { useNavigate } from "react-router-dom";

const Items = ({
  loadingMoreItems,
  tokensContinuation,
  address,
  items,
  itemFilters,
  setItemFilters,
  collectionInfo,
  loadingItems,
  searchText,
  setSearchText,
  debounceSearch,
  options,
  selectedItem,
  setSelectedItem,
  fetchMoreTokens,
}) => {

  const { userCartItems } = useContext(UserDataContext);
  const firstRender = useFirstRender();

  const observer = useRef(null);

  const navigate = useNavigate();

  const {
    buyNowModalData,
    showBuyNowModal,
    openBuyModal,
    closeBuynowModal,
    setBuyNowModalData,
  } = useGetBuyNowModalFunctions();


  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && tokensContinuation.current) {
        fetchMoreTokens();
      }
    }, options);

    const target = document.querySelector(
      ".collection-single-item-container.last-token"
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
  }, [items]);

  useEffect(() => {
    if (firstRender) return;
    changeSorting("tokenId", debounceSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch]);

  const conditionallyBuynowProps = {};
  if (itemFilters.priceFilter.min || itemFilters.priceFilter.max) {
    conditionallyBuynowProps.isChecked = true;
    conditionallyBuynowProps.isDisabled = true;
  }

  function changeSorting(parameter, value) {
    switch (parameter) {
      case "sortby":
        setItemFilters(prev => ({ ...prev, sortBy: value }));
        break;
      case "buynow":
        if (value) setItemFilters(prev => ({ ...prev, buyNowChecked: true }));
        else setItemFilters(prev => ({ ...prev, buyNowChecked: false }));
        break;
      case "tokenId":
        setItemFilters(prev => ({ ...prev, tokenId: value }));
        break;
      default:
        break;
    }
  }

  function changeAttributeFilter(checked, attributeKey, attributeValue) {
    if (checked) {
      setItemFilters(prev => ({
        ...prev,
        attributeFilter: [
          ...prev.attributeFilter,
          { attributeKey, attributeValue },
        ],
      }));
    } else {
      let filteredAttributes = itemFilters.attributeFilter.filter(
        attr => attr.attributeValue !== attributeValue
      );
      setItemFilters(prev => ({
        ...prev,
        attributeFilter: filteredAttributes,
      }));
    }
  }

  function applyChanges() {
    const priceOptions = Array.from(
      document.querySelectorAll(".collection-item-price-filter")
    );

    const max = priceOptions[1].value ? priceOptions[1].value : undefined;
    const min = priceOptions[0].value ? priceOptions[0].value : undefined;

    if (
      !_.isEqual(
        { ...itemFilters },
        { ...itemFilters, priceFilter: { min, max } }
      )
    ) {
      setItemFilters(prev => ({
        ...prev,
        priceFilter: { min, max },
      }));
    }
  }

  function animateAddToCart(index, image) {
    const item = document.querySelectorAll(".collection-single-item-container")[
      index
    ];
    const cart = document.querySelector(".header-cart-item");

    const cartX =
      -1 * (window.screenX - cart.getBoundingClientRect().x) -
      cart.getBoundingClientRect().width;
    const cartY = cart.getBoundingClientRect().y;

    const itemX = window.screenX - item.getBoundingClientRect().x;
    const itemY = item.getBoundingClientRect().y;

    const imageTag = document.createElement("img");
    imageTag.src = image;
    imageTag.style.height = "200px";
    imageTag.style.position = "fixed";
    imageTag.style.top = itemY + "px";
    imageTag.style.right = itemX + "px";
    imageTag.style.zIndex = "1000";
    imageTag.style.borderRadius = "10px";
    imageTag.style.transition = "all 250ms linear";

    item.appendChild(imageTag);

    setTimeout(() => {
      imageTag.style.top = cartY + "px";
      imageTag.style.right = cartX + "px";
      imageTag.style.height = "30px";

      setTimeout(() => {
        imageTag.remove();
      }, 240);
    }, 10);
  }

  const { addItemToCart } = useAddItemToCart(address, (index, image) => {
    animateAddToCart(index, image);
  });

  const { removeItemFromCart } = useRemoveItemFromCart();

  const { buyNow } = useBuyNow(() => {
    setBuyNowModalData({});
    closeBuynowModal(undefined, true);
  });

  const itemsMapping = useMemo(
    () =>
      items &&
      items.map((item, index) => {
        const { tokenId, name, image, rarityRank, isFlagged } = item?.token;
        const isInCart = userCartItems.some(
          item => item.tokenId.toString() === tokenId.toString()
        );

        const collectionName = item?.token?.collection?.name;
        const collectionImage = item?.token?.collection?.image;

        const value = item?.market?.floorAsk?.price?.amount?.decimal;
        const marketplace = item?.market?.floorAsk?.source?.name;
        const marketplaceIcon = item?.market?.floorAsk?.source?.icon;
        const marketplaceUrl = item?.market?.floorAsk?.source?.url;

        let isListed = false;
        if (value) isListed = true;

        const marketplaceImg =
          getMarketplaceImage(marketplace) || marketplaceIcon;

        const isLast = index === items.length - 1;

        return (
          <div
            className={`collection-single-item-container ${isLast && "last-token"
              }`}
            key={index}
          >
            <div
              className={`collection-item-details-container ${isInCart && "item-cart-selected"
                }`}
            >
              <div className="collection-item-image-hover-overflow">
                <img
                  src={image || collectionImage}
                  alt=""
                  className="collection-single-item-image"
                  onClick={() => navigate(`/item/${address}/${tokenId}`)}
                />

                {isListed && (
                  <>
                    <a href={marketplaceUrl} target="_blank" rel="noreferrer">
                      <img
                        src={marketplaceImg}
                        className="collection-item-marketplace-image"
                        alt=""
                      />
                    </a>

                    {isFlagged && (
                      <Tooltip
                        closeOnClick={false}
                        hasArrow
                        label={"Not currently tradable on OpenSea."}
                        fontSize="xs"
                        bg="black"
                        color={"white"}
                        border="1px solid white"
                        placement="top"
                        borderRadius={"7px"}
                      >
                        <img
                          src={flaggedImg}
                          className="collection-items-flagged-img"
                          alt=""
                        />
                      </Tooltip>
                    )}
                  </>
                )}

                {rarityRank && (
                  <div className="collection-item-rarity-box">
                    <p># {rarityRank}</p>
                  </div>
                )}

                {isInCart && (
                  <div className="collection-item-selected-cart-check">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </div>

              <div className="collection-items-item-stats">
                <div>
                  <p className="collection-item-single-collection-name">
                    {collectionInfo?.name}
                  </p>
                  <div className="collection-item-single-item-name-price">
                    <p className="collection-item-single-item-name">
                      {name || tokenId}
                    </p>
                    {isListed && (
                      <div className="collection-item-single-item-price">
                        <i className="fa-brands fa-ethereum" />
                        <p>{roundPrice(value)}</p>
                      </div>
                    )}
                  </div>
                </div>
                <hr></hr>

                <div className="collection-item-buy-container">
                  {/* {rarityRank} */}
                  {isListed && (
                    <>
                      <div
                        onClick={() =>
                          openBuyModal(
                            name,
                            image,
                            tokenId,
                            value,
                            marketplace,
                            address,
                            collectionName
                          )
                        }
                      >
                        <i className="fa-regular fa-bolt"></i>
                        <p className="item-buy-not-visible">Buy now</p>
                      </div>

                      <div
                        onClick={() =>
                          isInCart
                            ? removeItemFromCart(tokenId, address)
                            : addItemToCart(
                              name,
                              tokenId,
                              value,
                              image,
                              marketplace,
                              collectionName,
                              index
                            )
                        }
                      >
                        <i className="fa-light fa-cart-shopping item-buy-not-visible"></i>
                        <p className="item-buy-not-visible">
                          {isInCart ? "Remove" : "Add"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, userCartItems]
  );

  return (
    <>
      {
        <BuyNowModal
          buyNowModalData={buyNowModalData}
          showBuyNowModal={showBuyNowModal}
          buyNow={buyNow}
          closeBuynowModal={closeBuynowModal}
        />
      }
      <hr className="collection-item-hr"></hr>

      <div className="collection-item-section">
        <div className="collection-item-filters-container">
          <div className="collection-item-filter-section1">
            <div className="collection-item-filter-buynow">
              <p>BUY NOW</p>
              <Switch
                {...conditionallyBuynowProps}
                colorScheme={"red"}
                onChange={e => changeSorting("buynow", e.target.checked)}
              />
            </div>
          </div>

          <hr className="collection-item-filter-hr" />

          <div className="collection-item-filter-section2">
            <div className="collection-item-filter-pricerange">
              <p className="collection-item-filter-pricerange-name">
                PRICE RANGE
              </p>
              <HStack>
                <NumberInput defaultValue={itemFilters?.priceFilter?.min}>
                  <HStack>
                    <NumberInputField
                      placeholder="Min"
                      className="collection-item-price-filter collection-item-pricefilter-min"
                    />
                  </HStack>
                </NumberInput>
                <p>-</p>
                <NumberInput defaultValue={itemFilters?.priceFilter?.max}>
                  <HStack>
                    <NumberInputField
                      placeholder="Max"
                      className="collection-item-price-filter"
                    />
                  </HStack>
                </NumberInput>
              </HStack>
            </div>

            <div className="collection-item-filter-marketplace">
              <p className="collection-item-filter-marketplace-name">
                Marketplace:
              </p>
              <Checkbox
                defaultChecked={true}
                isDisabled
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                Opensea
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={true}
                isDisabled
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                X2Y2
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={true}
                isDisabled
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                LooksRare
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={true}
                isDisabled
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                Sudoswap
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={true}
                isDisabled
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                Alienswap
              </Checkbox>
            </div>

            <Button
              colorScheme={"blue"}
              onClick={applyChanges}
              className="collection-item-filter-apply"
            >
              Apply
            </Button>
          </div>

          <hr className="collection-item-filter-hr" />

          <div className="collection-item-filter-section3">
            <Accordion allowMultiple>
              {useMemo(
                () =>
                  collectionInfo?.attributes?.map((item, index) => {
                    const attributeName = item.key;

                    const length = item?.values?.length;
                    return (
                      <AccordionItem>
                        <AccordionButton
                          backgroundColor={"transparent"}
                          padding="15px 5px"
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            display={"flex"}
                            alignItems="center"
                            gap="10px"
                          >
                            <i className="fa-solid fa-filters"></i>
                            <p>{attributeName}</p>
                          </Box>

                          <span className="mr-10 little-text low-opacity">{length}</span>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {item?.values &&
                            item.values.map(innerItem => {
                              const attributeValue = innerItem.value;
                              const { count } = innerItem;

                              return (
                                <>
                                  <Row>
                                    <Checkbox
                                      defaultChecked={
                                        itemFilters?.attributeFilter?.filter(
                                          item =>
                                            item.attributeKey === attributeName &&
                                            item.attributeValue === attributeValue
                                        ).length > 0
                                          ? true
                                          : false
                                      }
                                      size={"sm"}
                                      className="collection-item-marketplace-filter"
                                      key={crypto.randomUUID()}
                                      value={attributeValue}
                                      onChange={e =>
                                        changeAttributeFilter(
                                          e.target.checked,
                                          attributeName,
                                          attributeValue
                                        )
                                      }
                                    >
                                      {attributeValue}
                                    </Checkbox>
                                    <span className="little-text low-opacity">{count}</span>
                                  </Row>
                                </>
                              );
                            })}

                          <Divider />
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [collectionInfo]
              )}
            </Accordion>
          </div>
        </div>

        <div className="collection-item-tokens-container">
          <div className="collection-item-token-sorts">
            <HStack gap="20px">
              <ItemSortSelect
                options={options}
                changeSorting={changeSorting}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
              <InputGroup>
                <i className="fa-regular fa-magnifying-glass collection-search-bar-lens"></i>
                <Input
                  placeholder="Search by token ID"
                  value={searchText}
                  className="collection-items-search-bar"
                  onChange={({ target }) => setSearchText(target.value)}
                ></Input>
              </InputGroup>
            </HStack>
          </div>

          {loadingItems ? (
            <div className="collection-skeleton-container">
              <SkeletonTheme
                baseColor="#202020"
                highlightColor="#444"
                height={"301px"}
                borderRadius={"10px"}
              >
                <p>
                  <Skeleton count={18} wrapper={SkeletonWrapper} />
                </p>
              </SkeletonTheme>
            </div>
          ) : (
            <>
              <div className="collection-items">
                {itemsMapping}
                {loadingMoreItems && (
                  <>
                    {[...Array(18)].map(item => {
                      return (
                        <SkeletonTheme
                          baseColor="#202020"
                          highlightColor="#444"
                          height={"301px"}
                          borderRadius={"10px"}
                        >
                          <Skeleton count={1} wrapper={SkeletonWrapper} />
                        </SkeletonTheme>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Items;

const SkeletonWrapper = ({ children }) => {
  return <span className="collection-items-single-skeleton">{children}</span>;
};

const ItemSortSelect = ({
  options,
  changeSorting,
  selectedItem,
  setSelectedItem,
}) => {
  const [active, setActive] = useState(false);

  const changeSelector = option => {
    changeSorting("sortby", option.value);
    setSelectedItem(option);
  };

  useEffect(() => {
    window.addEventListener("click", toggleSelector);

    return () => {
      window.removeEventListener("click", toggleSelector);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelector = e => {
    const container = document.querySelector(".item-sort-select-container");
    const path = e.composedPath();
    if (!active && !path.includes(container)) {
      setActive(false);
    } else {
      setActive(prev => !prev);
    }
  };

  const mappedOptions = useMemo(() => {
    return (
      <div className="item-sort-options">
        {options.map((option, index) => {
          const { value, label } = option;

          return (
            <p key={index} value={value} onClick={() => changeSelector(option)}>
              {label}
            </p>
          );
        })}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="item-sort-select-container">
      <div className="item-sort-select-visible">
        <p className="item-sort-select-name" value={selectedItem.value}>
          {selectedItem.label}
        </p>
        <i className="fa-sharp fa-solid fa-caret-down sort-arrow"></i>
      </div>

      {active && mappedOptions}
    </div>
  );
};
