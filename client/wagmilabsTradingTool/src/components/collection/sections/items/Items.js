import React, { useEffect, useState, useContext, useMemo } from "react";
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
} from "@chakra-ui/react";

import { UserDataContext } from "../../../../context/userContext";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import addToCart from "../../../../utils/database-functions/addToCart";
import { roundPrice } from "../../../../utils/formats/formats";

import { fetchSigner } from "@wagmi/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import getMarketplaceImage from "../../../../utils/marketplaceImageMapping";
import {useDebounce} from "use-debounce"


const options = [
  { value: "p-lth", label: "Price: low to high" },
  { value: "p-htl", label: "Price: high to low" },
  { value: "t-lth", label: "TokenId: low to high" },
  { value: "t-htl", label: "TokenId: high to low" },
  { value: "r-htl", label: "Rarity: high to low" },
  { value: "r-lth", label: "Rarity: low to high" },
];


const Items = ({ address, items, itemFilters, setItemFilters, collectionInfo, loadingItems }) => {

  const [searchText, setSearchText] = useState("")
  const [debounceSearch] = useDebounce(searchText, 400)


  useEffect(()=>{
    changeSorting("tokenId", debounceSearch)
  }, [debounceSearch])



  const conditionallyBuynowProps = {

  }
  if((itemFilters.priceFilter.min || itemFilters.priceFilter.max)){
    conditionallyBuynowProps.isChecked = true
    conditionallyBuynowProps.isDisabled = true
  }


  const { setUserCartItems, gasSettings } = useContext(UserDataContext);



  
  async function addItemToCart(name, tokenId, price, image, marketplace, collectionName) {
    let pushStatus = await addToCart({
      name,
      collectionName,
      tokenId,
      price,
      image,
      marketplace,
      contractAddress: address,
    });
    if (pushStatus === "success") {
      setUserCartItems((prevItems) => [
        ...prevItems,
        { name, tokenId, price, image, marketplace, collectionName, contractAddress: address },
      ]);
    }
  }

  async function buyNow(contract, tokenId, marketplace, value) {
    const signer = await fetchSigner();
    const maxFeePerGas = (gasSettings.maxFeePerGas * 1000000000).toString();
    const maxPriorityFeePerGas = (
      gasSettings.maxPriorityFeePerGas * 1000000000
    ).toString();

    getClient()?.actions.buyToken({
      tokens: [{ tokenId, contract: contract }],
      signer,
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




  function changeSorting(parameter, value) {
    switch (parameter) {
      case "sortby":
        setItemFilters((prev) => ({ ...prev, sortBy: value }));
        break;
      case "buynow":
        if(value) setItemFilters((prev) => ({ ...prev, buyNowChecked: true}));
        else setItemFilters((prev) => ({ ...prev, buyNowChecked: false}));
        break;
      case "tokenId":
        setItemFilters(prev => ({...prev, tokenId: value}))
    }
  }

  function changeAttributeFilter(checked, attributeKey, attributeValue){
    if(checked){
      setItemFilters((prev) => ({
        ...prev,
        attributeFilter: [...prev.attributeFilter, {attributeKey, attributeValue}],
      }));
    }
    else{
      let filteredAttributes = itemFilters.attributeFilter.filter(attr => attr.attributeValue !== attributeValue)
      setItemFilters((prev) => ({
        ...prev,
        attributeFilter: filteredAttributes
      }))
    }
  }

  function applyChanges() {
    const priceOptions = Array.from(
      document.querySelectorAll(".collection-item-price-filter")
    );

    const max = priceOptions[1].value ? priceOptions[1].value : undefined;
    const min = priceOptions[0].value ? priceOptions[0].value : undefined;

    if (!_.isEqual({ ...itemFilters },{...itemFilters, priceFilter: { min, max }}) ){
      setItemFilters((prev) => ({
        ...prev,
        priceFilter: { min, max },
      }));
    }
  }




  const itemsMapping = useMemo(() => 
      items.map((item, index) => {
        const { tokenId, name, image, rarityRank } = item?.token;

        const collectionName = item?.token?.collection?.name
        const collectionImage = item?.token?.collection?.image;

        const value = item?.market?.floorAsk?.price?.amount?.decimal;
        const marketplace = item?.market?.floorAsk?.source?.name;
        const marketplaceIcon = item?.market?.floorAsk?.source?.icon;
        const marketplaceUrl = item?.market?.floorAsk?.source?.url;

        let isListed = false;
        if (value) isListed = true;

        const marketplaceImg = getMarketplaceImage(marketplace) || marketplaceIcon;

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
                  <a href={marketplaceUrl} target="_blank">
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
                        <p className="item-buy-not-visible" onClick={() => addItemToCart( name, tokenId, value, image, marketplace, collectionName)}>
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
                {...conditionallyBuynowProps}
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
              <Checkbox defaultChecked={true} isDisabled size={"sm"} className="collection-item-marketplace-filter">
                Opensea
              </Checkbox>
              <br />
              <Checkbox defaultChecked={true} isDisabled  size={"sm"} className="collection-item-marketplace-filter">
                X2Y2
              </Checkbox>
              <br />
              <Checkbox defaultChecked={true} isDisabled  size={"sm"} className="collection-item-marketplace-filter">
                LooksRare
              </Checkbox>
              <br />
              <Checkbox defaultChecked={true} isDisabled  size={"sm"} className="collection-item-marketplace-filter">
                Sudoswap
              </Checkbox>
              <br />
              <Checkbox defaultChecked={true} isDisabled  size={"sm"} className="collection-item-marketplace-filter">
                Alienswap
              </Checkbox>
            </div>

            <Button colorScheme={"blue"} onClick={applyChanges} className="collection-item-filter-apply">
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
                                    key={innerIndex}
                                    value={innerKey}
                                    onChange={(e) => changeAttributeFilter(e.target.checked, key, innerKey)}
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
                  onChange={({target}) => setSearchText(target.value)} 
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
