import React, { useEffect, useState, useContext, useMemo } from "react";
import "./items.css";
import question from "../../../../assets/question.png";
import baseUrl from "../../../../variables/baseUrl";

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
} from "@chakra-ui/react";

import { UserDataContext } from "../../../../context/userContext";
import { getClient, Execute } from "@reservoir0x/reservoir-kit-client";
import addToCart from "../../../../utils/database-functions/addToCart";
import { formatIpfs, roundPrice } from "../../../../utils/formats/formats";

import openseaImg from "../../../../assets/opensea.svg";
import x2y2Img from "../../../../assets/x2y2.svg";
import looksrareImg from "../../../../assets/looksrare.svg";
import sudoswapImg from "../../../../assets/sudoswap.svg";
import { fetchSigner } from "@wagmi/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const options = [
  { value: "p-lth", label: "Price: low to high" },
  { value: "p-htl", label: "Price: high to low" },
  { value: "t-lth", label: "TokenId: low to high" },
  { value: "t-htl", label: "TokenId: high to low" },
  { value: "r-htl", label: "Rarity: high to low" },
];

const Items = ({
  address,
  items,
  sorts,
  setSorts,
  buyNowChecked,
  setBuyNowChecked,
  collectionInfo,
  loadingItems,
}) => {
  const { setUserCartItems, gasSettings } = useContext(UserDataContext);

  function changeSorting(parameter, value) {
    if (value && parameter === "buynow") setBuyNowChecked(true);
    else if (
      !value &&
      !sorts.marketplaces.opensea &&
      !sorts.marketplaces.x2y2 &&
      !sorts.marketplaces.looksrare &&
      !sorts.priceFilter.max &&
      !sorts.priceFilter.min &&
      parameter === "buynow"
    )
      setBuyNowChecked(false);

    switch (parameter) {
      case "buynow":
        if (
          !sorts.marketplaces.opensea &&
          !sorts.marketplaces.x2y2 &&
          !sorts.marketplaces.looksrare &&
          !sorts.priceFilter.max &&
          !sorts.priceFilter.min
        ) {
          setSorts((prev) => ({ ...prev, buyNow: value }));
        }
        break;
      case "sortby":
        setSorts((prev) => ({ ...prev, sortBy: value }));
    }
  }

  function applyChanges() {
    const marketplaceOptions = Array.from(
      document.querySelectorAll(".collection-item-marketplace-filter input")
    );
    const priceOptions = Array.from(
      document.querySelectorAll(".collection-item-price-filter")
    );
    const opensea = marketplaceOptions[0].checked;
    const x2y2 = marketplaceOptions[1].checked;
    const looksrare = marketplaceOptions[2].checked;

    const max = priceOptions[1].value ? priceOptions[1].value : undefined;
    const min = priceOptions[0].value
      ? priceOptions[0].value
      : !opensea && !x2y2 && !looksrare && !max
      ? undefined
      : "0";
    console.log(min);

    if (
      !_.isEqual(
        { ...sorts },
        {
          ...sorts,
          marketplaces: { opensea, x2y2, looksrare },
          priceFilter: { min, max },
        }
      )
    ) {
      if (min === undefined) setBuyNowChecked(false);
      else setBuyNowChecked(true);
      setSorts((prev) => ({
        ...prev,
        marketplaces: { opensea, x2y2, looksrare },
        priceFilter: { min, max },
      }));
    }
  }

  async function addItemToCart(name, tokenId, price, image, marketplace) {
    let pushStatus = await addToCart({
      name,
      tokenId,
      price,
      image,
      marketplace,
      contractAddress: address,
    });
    if (pushStatus === "success") {
      setUserCartItems((prevItems) => [
        ...prevItems,
        { name, tokenId, price, image, marketplace, contractAddress: address },
      ]);
    }
  }

  async function buyNow(contract, tokenId, marketplace, value) {
    const signer = await fetchSigner();
    const maxFeePerGas = (gasSettings.maxFeePerGas * 1000000000).toString();
    const maxPriorityFeePerGas = (
      gasSettings.maxPriorityFeePerGas * 1000000000
    ).toString();

    console.log(maxFeePerGas, maxPriorityFeePerGas);

    getClient()?.actions.buyToken({
      tokens: [{ tokenId, contract: contract }],
      signer,
      // options: {
      // preferredOrderSource: "x2y2.io"
      // },
      options: {
        maxFeePerGas,
        maxPriorityFeePerGas,
      },
      expectedPrice: value,
      onProgress: (steps) => {
        console.log(steps);
      },
    });
  }

  const itemsMapping = useMemo(
    () =>
      items.map((item, index) => {
        const { tokenId, name, image, rarityRank } = item?.token;
        const collectionImage = item?.token?.collection?.image;

        const value = item?.market?.floorAsk?.price?.amount?.decimal;
        const marketplace = item?.market?.floorAsk?.source?.name;
        const marketplaceIcon = item?.market?.floorAsk?.source?.icon;
        const marketplaceUrl = item?.market?.floorAsk?.source?.url;

        let isListed = false;
        if (value) isListed = true;

        let marketplaceImg;
        let marketplaceLink;

        switch (marketplace?.toLowerCase()) {
          case "opensea":
            marketplaceImg = openseaImg;
            marketplaceLink = `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
            break;
          case "x2y2":
            marketplaceImg = x2y2Img;
            marketplaceLink = `https://x2y2.io/eth/${address}/${tokenId}`;
            break;
          case "looksrare":
            marketplaceImg = looksrareImg;
            marketplaceLink = `https://looksrare.org/collections/${address}/${tokenId}`;
            break;
          case "sudoswap":
            marketplaceImg = sudoswapImg;
            marketplaceLink = `https://sudoswap.xyz/browse/buy/${address}`;
            break;
          default:
            marketplaceImg = marketplaceIcon
            marketplaceLink = marketplaceUrl
        }

        return (
          <div className="collection-single-item-container" key={index}>
            <div className="collection-item-details-container">
              <div className="collection-item-image-hover-overflow">
                <img
                  src={image || collectionImage}
                  alt=""
                  className="collection-single-item-image"
                />

                {isListed && (
                  <a href={marketplaceLink} target="_blank">
                    <img
                      src={marketplaceImg}
                      className="collection-item-marketplace-image"
                    ></img>
                  </a>
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
                      <div>
                        <i className="fa-regular fa-bolt"></i>
                        <p
                          className="item-buy-not-visible"
                          onClick={() =>
                            buyNow(address, tokenId, marketplace, value)
                          }
                        >
                          Buy now
                        </p>
                      </div>

                      <div>
                        <i className="fa-light fa-cart-shopping item-buy-not-visible"></i>
                        <p
                          className="item-buy-not-visible"
                          onClick={() =>
                            addItemToCart(
                              name,
                              tokenId,
                              value,
                              image,
                              marketplace
                            )
                          }
                        >
                          Add
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
    [items]
  );

  return (
    <>
      <hr className="collection-item-hr"></hr>

      <div className="collection-item-section">
        <div className="collection-item-filters-container">
          <div className="collection-item-filter-section1">
            <div className="collection-item-filter-buynow">
              <p>BUY NOW</p>
              <Switch
                isChecked={buyNowChecked}
                colorScheme={"red"}
                onChange={(e) => changeSorting("buynow", e.target.checked)}
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
                <NumberInput>
                  <HStack>
                    <NumberInputField
                      placeholder="Min"
                      className="collection-item-price-filter collection-item-pricefilter-min"
                    />
                  </HStack>
                </NumberInput>
                <p>-</p>
                <NumberInput>
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
                defaultChecked={false}
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                Opensea
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={false}
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                X2Y2
              </Checkbox>
              <br />
              <Checkbox
                defaultChecked={false}
                size={"sm"}
                className="collection-item-marketplace-filter"
              >
                LooksRare
              </Checkbox>
              <br />
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
              {collectionInfo.attributes &&
                Object.keys(collectionInfo?.attributes).map((key, index) => {
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
                          <p>{key}</p>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel pb={4}>
                        {collectionInfo?.attributes[key] &&
                          Object.keys(collectionInfo?.attributes[key]).map(
                            (innerKey, innerIndex) => {
                              return (
                                <>
                                  <Checkbox
                                    defaultChecked={false}
                                    size={"sm"}
                                    className="collection-item-marketplace-filter"
                                  >
                                    {innerKey}
                                  </Checkbox>
                                  <br />
                                </>
                              );
                            }
                          )}

                        <Divider />
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </div>
        </div>

        <div className="collection-item-tokens-container">
          <div className="collection-item-token-sorts">
            <HStack gap="20px">
              <ItemSortSelect options={options} changeSorting={changeSorting} />
              <InputGroup>
                <i className="fa-regular fa-magnifying-glass collection-search-bar-lens"></i>
                <Input
                  placeholder="Search by token ID"
                  className="collection-items-search-bar"
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
            <div className="collection-items">{itemsMapping}</div>
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

const ItemSortSelect = ({ options, changeSorting }) => {
  const [selectedItem, setSelectedItem] = useState(options[0]);
  const [active, setActive] = useState(false);

  const changeSelector = (option) => {
    changeSorting("sortby", option.value);
    setSelectedItem(option);
  };

  useEffect(() => {
    window.addEventListener("click", toggleSelector);

    return () => {
      window.removeEventListener("click", toggleSelector);
    };
  }, []);

  const toggleSelector = (e) => {
    const container = document.querySelector(".item-sort-select-container");
    const path = e.composedPath()
    if (!active && !path.includes(container)) return;

    setActive((prev) => !prev);
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
