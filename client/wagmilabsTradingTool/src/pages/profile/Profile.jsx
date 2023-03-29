import React, { useContext, useEffect, useState, useRef } from "react";
import { baseUrl } from "@Variables";
import { Portal } from "react-portal";
import { formatAddress } from "@Utils/formats/formats";
import { useAccount, useEnsName } from "wagmi";

import { useDebounce } from "use-debounce";
import {
  RadioGroup,
  Stack,
  Radio,
  Select,
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  Tooltip,
} from "@chakra-ui/react";

import { UserDataContext } from "@Context";

import copy from "copy-to-clipboard";
import { useGetItems, useSetPageTitle } from "@Hooks";
import { LoadingSpinner, ProfitCalcModal } from "@Components";
import { useNavigate, useParams } from "react-router-dom";
import { placeholderImage } from "@Assets";
import { Nfts, Activity, Stats } from "./Components";

import "./profile.scss";

const sortItemsOptions = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

const Profile = () => {
  const { address: pageAddress } = useParams();
  const navigate = useNavigate();

  const [profileImageUrl] = useState(window.location.search?.replace("?image=", ""));

  useEffect(() => {
    if (pageAddress && (pageAddress.length !== 42 || !pageAddress.startsWith("0x"))) {
      navigate("/notfound");
    }
  }, [pageAddress, navigate]);

  const { address } = useAccount();
  const ensName = useEnsName({ address: pageAddress });

  const [isOwner] = useState(pageAddress?.toLowerCase() === address?.toLowerCase());

  const { listingSettings, setListingSettings, profileImage, setProfileImage } = useContext(UserDataContext);

  const [userAddress] = useState(address);
  const [pnl, setPnl] = useState({});
  const [userEns] = useState(ensName?.data);
  const [collections, setCollections] = useState([]);
  const [section, setSection] = useState("nft");
  const [loadingData, setLoadingData] = useState(true);

  const [loadingMoreNfts, setLoadingMoreNfts] = useState(false);
  const nftsContinuation = useRef();

  const [openListingSettings, setOpenListingSettings] = useState(false);
  const [stageListingSettings, setStageListingSettings] = useState(listingSettings);

  const [selectedSortOption, setSelectedSortOption] = useState(sortItemsOptions[0]);

  const [nftsCollectionFilter, setNftsCollectionFilter] = useState("");

  const [searchCollectionText, setSearchCollectionText] = useState("");
  const [debounceCollectionSearch] = useDebounce(searchCollectionText, 400);

  const [copyState, setCopyState] = useState({ ens: "Copy", address: "Copy" });
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    loading: loadingNfts,
    setLoading: setLoadingNfts,
    items: userItems,
    continuation,
    setItems: setUserItems,
  } = useGetItems("50", selectedSortOption.value, nftsCollectionFilter, pageAddress);

  nftsContinuation.current = continuation;

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSetPageTitle("Profile | Wagmi Labs");

  useEffect(() => {
    fetchUserCollections(debounceCollectionSearch, 0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceCollectionSearch]);

  async function fetchUserCollections(query, offset, limit) {
    try {
      let data = await fetch(
        `${baseUrl}/profileCollections?search=${query}&offset=${offset}&limit=${limit}&address=${pageAddress}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );
      data = await data.json();

      const { collections } = data;

      setCollections(collections);
    } catch (e) {
      setCollections([]);
    }
  }

  async function fetchMoreItems() {
    try {
      setLoadingMoreNfts(true);
      const continuationFilter = nftsContinuation.current ? `&continuation=${nftsContinuation.current}` : "";
      let data = await fetch(
        `${baseUrl}/profileItems?sortDirection=${selectedSortOption.value}&collection=${nftsCollectionFilter}&address=${pageAddress}${continuationFilter}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.jsonwebtoken,
          },
        }
      );

      data = await data.json();

      const { tokens, continuation } = data;

      nftsContinuation.current = continuation;
      setUserItems(prev => [...prev, ...tokens]);
      setLoadingMoreNfts(false);
    } catch (e) {
      setUserItems([]);
      setLoadingNfts(false);
    }
  }

  async function fetchUserData() {
    try {
      setLoadingData(true);
      const res = await fetch(`${baseUrl}/profileStats?address=${pageAddress}`, {
        headers: {
          "x-auth-token": localStorage.jsonwebtoken,
        },
      });
      const stats = await res.json();

      const { ok, data } = stats || {};

      if (ok) {
        const {
          num_txs,
          num_assets_owned,
          num_collections_owned,
          total_gain,
          nftsValue,
          walletVolume,
          mint_count,
          sold_count,
          bought_count,
          sold_value,
        } = data || {};

        setPnl({
          nfts: num_assets_owned,
          collections: num_collections_owned,
          totalTxs: num_txs,
          nftsValue,
          realizedPnl: total_gain,
          walletVolume,
          mintCount: mint_count,
          soldCount: sold_count,
          boughtCount: bought_count,
          soldValue: sold_value,
        });
      }
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      setPnl({
        nfts: 0,
        collections: 0,
        totalTxs: 0,
        nftsValue: 0,
        realizedPnl: 0,
        walletVolume: 0,
        mintCount: 0,
        soldCount: 0,
        boughtCount: 0,
        soldValue: 0,
      });
      console.log(e);
    }
  }

  const toggleListingSettings = state => {
    setOpenListingSettings(state);
    document.body.style.overflow = state ? "hidden" : "auto";
  };

  const saveListingSettings = async () => {
    try {
      const bodyObj = stageListingSettings;

      let response = await fetch(`${baseUrl}/updateListingSettings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
        body: JSON.stringify(bodyObj),
      });
      response = await response.json();

      if (response?.updated) {
        setListingSettings(bodyObj);
      }
    } catch (e) {
      console.log(e);
    }

    toggleListingSettings(false);
  };

  function modifyStageListing(type, value) {
    switch (type) {
      case "priceType":
        setStageListingSettings(old => ({
          ...old,
          price: { ...old.price, type: value },
        }));
        break;
      case "profitType":
        setStageListingSettings(old => ({
          ...old,
          price: { ...old.price, profitType: value },
        }));
        break;
      case "profitValue":
        setStageListingSettings(old => ({
          ...old,
          price: { ...old.price, profitValue: value },
        }));
        break;
      case "months":
        setStageListingSettings(old => ({
          ...old,
          time: { ...old.time, months: value },
        }));
        break;
      case "days":
        setStageListingSettings(old => ({
          ...old,
          time: { ...old.time, days: value },
        }));
        break;
      case "hours":
        setStageListingSettings(old => ({
          ...old,
          time: { ...old.time, hours: value },
        }));
        break;
      case "minutes":
        setStageListingSettings(old => ({
          ...old,
          time: { ...old.time, minutes: value },
        }));
        break;
      case "marketplace":
        setStageListingSettings(old => ({ ...old, marketplace: value }));
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    !openListingSettings && listingSettings && setStageListingSettings(listingSettings);
  }, [openListingSettings, listingSettings]);

  function copyData(type, data) {
    copy(data);

    setCopyState(old => ({ ...old, [type]: "Copied!" }));
    setTimeout(() => {
      setCopyState(old => ({ ...old, [type]: "Copy" }));
    }, 1000);
  }

  return (
    <>
      {openListingSettings && (
        <Portal>
          <div className="bg-modal"></div>
          <section className="nft-listings-settings-modal">
            {listingSettings ? (
              <>
                <button onClick={() => toggleListingSettings(false)} className="smart-listings-close-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="nft-listing-settings-modal-container">
                  <div className="listing-settings-title">
                    <p>Smart listing settings</p>
                  </div>

                  <div className="listing-settings-price">
                    <p>Price type:</p>
                    <div>
                      <RadioGroup
                        onChange={value => modifyStageListing("priceType", value)}
                        value={stageListingSettings.price.type}
                      >
                        <Stack direction="row">
                          <Radio value="break-even">Break even</Radio>
                          <Radio value="profit">Profit</Radio>
                        </Stack>
                      </RadioGroup>
                    </div>

                    {stageListingSettings.price.type === "profit" && (
                      <div className="listing-settings-profit-amount">
                        <label htmlFor="profit-radio-button">Profit amount</label>
                        <div className="listing-settings-profit-values">
                          <Stack direction={"row"} alignItems="center">
                            <NumberInput value={stageListingSettings?.price?.profitValue}>
                              <HStack>
                                <NumberInputField
                                  className="listing-settings-value"
                                  placeholder="Amount"
                                  onChange={e => modifyStageListing("profitValue", e.target.value)}
                                />
                              </HStack>
                            </NumberInput>

                            <Select
                              name=""
                              id=""
                              className="listing-settings-currency-type"
                              value={stageListingSettings?.price?.profitType}
                              onChange={e => modifyStageListing("profitType", e.target.value)}
                            >
                              <option value="%">%</option>
                              <option value="eth">ETH</option>
                              <option value="usd">USD</option>
                            </Select>
                          </Stack>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="listing-settings-time">
                    <div>Listing will be active for:</div>

                    <HStack>
                      <Select
                        id="listing-settings-months"
                        onChange={e => modifyStageListing("months", e.target.value)}
                        value={stageListingSettings?.time?.months}
                        size="sm"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </Select>
                      <label htmlFor="listing-settings-months">Months</label>

                      <Select
                        id="listing-settings-days"
                        onChange={e => modifyStageListing("days", e.target.value)}
                        value={stageListingSettings?.time?.days}
                        size="sm"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                      </Select>
                      <label htmlFor="listing-settings-days">Days</label>

                      <Select
                        id="listing-settings-hours"
                        onChange={e => modifyStageListing("hours", e.target.value)}
                        value={stageListingSettings?.time?.hours}
                        size="sm"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                      </Select>
                      <label htmlFor="listing-settings-hours">hours</label>

                      <Select
                        id="listing-settings-minutes"
                        onChange={e => modifyStageListing("minutes", e.target.value)}
                        value={stageListingSettings?.time?.minutes}
                        size="sm"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="39">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="44">44</option>
                        <option value="45">45</option>
                        <option value="46">46</option>
                        <option value="47">47</option>
                        <option value="48">48</option>
                        <option value="49">49</option>
                        <option value="50">50</option>
                        <option value="51">51</option>
                        <option value="52">52</option>
                        <option value="53">53</option>
                        <option value="54">54</option>
                        <option value="55">55</option>
                        <option value="56">56</option>
                        <option value="57">57</option>
                        <option value="58">58</option>
                        <option value="59">59</option>
                        <option value="60">60</option>
                      </Select>
                      <label htmlFor="listing-settings-minutes">Minutes</label>
                    </HStack>
                  </div>

                  <div className="listing-settings-marketplace">
                    <label htmlFor="listing-settings-marketplace">Marketplace:</label>
                    <HStack>
                      <Select
                        name=""
                        id="listing-settings-marketplace"
                        onChange={e => modifyStageListing("marketplace", e.target.value)}
                        value={stageListingSettings.marketplace}
                      >
                        <option value="opensea">Opensea</option>
                        <option value="x2y2">X2Y2</option>
                        <option value="looksrare">LooksRare</option>
                      </Select>
                      <Button onClick={saveListingSettings}>Save</Button>
                    </HStack>
                  </div>
                </div>
              </>
            ) : (
              <>loading</>
            )}
          </section>
        </Portal>
      )}

      <section className="profile-section-container">
        <div className="profile-container">
          <div className="profileDetails">
            <img className="profilePfp" src={isOwner ? profileImage : profileImageUrl || placeholderImage} alt="" />
            <div className="profile-ens-address">
              {userEns && (
                <Tooltip
                  closeOnClick={false}
                  hasArrow
                  label={copyState.ens}
                  fontSize="xs"
                  bg="black"
                  color={"white"}
                  placement="top"
                  borderRadius={"7px"}
                >
                  <span onClick={() => copyData("ens", userEns)}>{userEns}</span>
                </Tooltip>
              )}

              <span>{pageAddress && userEns && "/"}</span>

              {pageAddress && (
                <Tooltip
                  closeOnClick={false}
                  hasArrow
                  label={copyState.address}
                  fontSize="xs"
                  bg="black"
                  color={"white"}
                  placement="top"
                  borderRadius={"7px"}
                >
                  <span onClick={() => copyData("address", pageAddress)} className="profile-address-copy">
                    {formatAddress(pageAddress)}
                  </span>
                </Tooltip>
              )}
            </div>

            <div className="profile-details-container">
              <div className="single-profile-detail">
                <div>NFTs</div>
                <p>
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.nfts || 0
                  )}
                </p>
              </div>

              <div className="single-profile-detail">
                <div>Unique colletions</div>
                <p>
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.collections || 0
                  )}
                </p>
              </div>

              <div className="single-profile-detail">
                <div>NFT transactions</div>
                <p>
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.totalTxs || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="profilePnl">
            <div className="number-profits-losses">
              <p>
                Mint count
                <div className="nft-pnl-profit">
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.mintCount || 0
                  )}
                </div>
              </p>

              <p>
                Bought count
                <div className="nft-pnl-profit">
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.boughtCount || 0
                  )}
                </div>
              </p>

              <p>
                Sold count
                <div className="nft-pnl-profit">
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    pnl?.soldCount || 0
                  )}
                </div>
              </p>

              <p>
                Sold value
                <div className="nft-pnl-profit">
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    <>
                      {pnl?.soldValue || 0}
                      <span className="eth-char-logo">Ξ</span>
                    </>
                  )}
                </div>
              </p>
            </div>

            <div className="avg-pnl">
              <p>
                NFTs avg. value
                <div className="nft-pnl-profit">
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    <span className={"nft-pnl-profit"}>
                      {Math.round(pnl.nftsValue * 1000) / 1000 || 0}
                      <span className="eth-char-logo">Ξ</span>
                    </span>
                  )}
                </div>
              </p>
              <p>
                Realized P&L
                <div>
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    <>
                      <span
                        className={Math.round(pnl.realizedPnl * 1000) / 1000 >= 0 ? "nft-pnl-profit" : "nft-pnl-loss"}
                      >
                        {Math.round(pnl.realizedPnl * 1000) / 1000 || 0}
                        <span className="eth-char-logo">Ξ</span>
                      </span>
                    </>
                  )}
                </div>
              </p>
              <p>
                Wallet volume
                <div>
                  {loadingData ? (
                    <LoadingSpinner width="15px" height="15px" padding="0" margin="10px 0 0 0" />
                  ) : (
                    <>
                      <span className={"nft-pnl-profit"}>
                        {Math.round(pnl.walletVolume * 1000) / 1000 || 0}
                        <span className="eth-char-logo">Ξ</span>
                      </span>
                    </>
                  )}
                </div>
              </p>
            </div>
          </div>
        </div>

        <div className="profile-sections-tabs">
          <div className="profile-sections">
            <div
              className={`single-profile-section ${section === "nft" ? "selected" : ""}`}
              onClick={() => setSection("nft")}
            >
              NFTs
            </div>
            <div
              className={`single-profile-section ${section === "activity" ? "selected" : ""}`}
              onClick={() => setSection("activity")}
            >
              Activity
            </div>
            <div
              className={`single-profile-section ${section === "stats" ? "selected" : ""}`}
              onClick={() => setSection("stats")}
            >
              Stats
            </div>
          </div>

          <div className="profile-watchList-settings">
            <div className="profile-settings">
              <span className="profile-calcs-button" onClick={() => setIsOpen(true)}>
                Calcs<i className="fa-solid fa-calculator"></i>
              </span>
              <ProfitCalcModal isOpen={isOpen} setIsOpen={setIsOpen} />
              {isOwner && (
                <div className="profile-settings-button" onClick={() => toggleListingSettings(true)}>
                  Smart list settings<i className="fa-solid fa-gear"></i>
                </div>
              )}
            </div>
          </div>
        </div>

        {(section === "nft" && (
          <Nfts
            loadingMoreNfts={loadingMoreNfts}
            fetchMoreItems={fetchMoreItems}
            nftsContinuation={nftsContinuation}
            nftsCollectionFilter={nftsCollectionFilter}
            setNftsCollectionFilter={setNftsCollectionFilter}
            searchCollectionText={searchCollectionText}
            setSearchCollectionText={setSearchCollectionText}
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            userItems={userItems}
            setProfileImage={setProfileImage}
            collections={collections}
            loadingNfts={loadingNfts}
            listingSettings={listingSettings}
            isOwner={isOwner}
          />
        )) ||
          ""}
        {(section === "activity" && <Activity userAddress={userAddress} pageAddress={pageAddress} />) || ""}
        {(section === "stats" && <Stats address={userAddress} />) || ""}
      </section>
    </>
  );
};

export default Profile;
