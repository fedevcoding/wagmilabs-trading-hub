import React, { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import "./search.scss";
import verified from "@Assets/verified.png";
import { baseUrl } from "@Variables";
import { fetchEnsAddress } from "@wagmi/core";
import { useFirstRender } from "@Hooks";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { placeholderImage } from "@Utils/images";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const EthereumSearch = ({ inLogin, isHeader, usage, onClick }) => {
  const firstRender = useFirstRender();

  const [text, setText] = useState("");
  const [value] = useDebounce(text, 500);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collections, setCollections] = useState([]);

  function removeCollections(e, force) {
    if (collections.length > 0) {
      if (force) {
        setCollections([]);
        return;
      } else {
        const collectionsContainer = document.querySelector(".container");
        const searchbar = document.querySelector(".search-bar");

        const path = e.composedPath();
        if (path.includes(collectionsContainer) || path.includes(searchbar)) return;

        setCollections([]);
      }
    }
  }

  useEffect(() => {
    window.addEventListener("click", removeCollections);

    return () => {
      window.removeEventListener("click", removeCollections);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  useEffect(() => {
    if (value === "" && !firstRender) {
      loadCollections(false);
    } else if (value) {
      fetchCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  async function fetchCollections() {
    try {
      setLoadingCollections(true);

      let query = value;
      if (isHeader && value?.endsWith(".eth")) {
        const address = await fetchEnsAddress({
          name: value,
          chainId: 1,
        });
        query = address;
      }

      let collectionsApi = await fetch(`${baseUrl}/search/${query}?showAddresses=${isHeader ? "true" : "false"}`);
      collectionsApi = await collectionsApi.json();

      const fetchedCollections = collectionsApi || {};

      setLoadingCollections(false);
      setCollections(fetchedCollections);
    } catch (e) {
      console.log(e);

      setLoadingCollections(false);
      setCollections([]);
    }
  }

  const memoList = useMemo(
    () =>
      collections &&
      collections.map((collection, index) => {
        const { image, name, openseaVerificationStatus, isLocaleStorage, isAddress } = collection || {};

        const address = collection?.address || collection.collectionId || collection.id;

        let link = `/collection/${address}`;
        if (isAddress) link = `/profile/${address}`;

        return (
          <React.Fragment key={JSON.stringify(collection)}>
            {usage === "sniperBot" ? (
              <div className={`container-div`} onClick={() => onClick(collection)}>
                <LazyLoadImage
                  visibleByDefault={true}
                  src={image}
                  className="collection-image"
                  effect="blur"
                  placeholderSrc={placeholderImage}
                />
                <div className="searchbar-collection-infos">
                  <div className="name-verified-container">
                    <p className="searchbar-collection-name">{name || "-------"}</p>
                    {openseaVerificationStatus === "verified" && <img className="verified" src={verified} alt="" />}
                  </div>
                  <p className="searchbar-collection-address">{address}</p>
                  {isLocaleStorage && (
                    <i
                      className="fa-solid fa-xmark searchbar-collection-remove"
                      onClick={e => removeFromLocalStorage(e, address)}
                    ></i>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={{ pathname: link, search: `${isAddress ? "?image=" + image : ""}` }}
                  className="container-div"
                  // target="_blank"
                  key={index}
                  onClick={e => addToLocalStorage(e, image, address, name, openseaVerificationStatus, isAddress)}
                  rel="noreferrer"
                >
                  <LazyLoadImage
                    visibleByDefault={true}
                    src={image}
                    className="collection-image"
                    effect="blur"
                    placeholderSrc={placeholderImage}
                  />
                  <div className="searchbar-collection-infos">
                    <div className="name-verified-container">
                      <p className="searchbar-collection-name">{name || "-------"}</p>
                      {openseaVerificationStatus === "verified" && <img className="verified" src={verified} alt="" />}
                    </div>
                    <p className="searchbar-collection-address">{address}</p>
                    {isLocaleStorage && (
                      <i
                        className="fa-solid fa-xmark searchbar-collection-remove"
                        onClick={e => removeFromLocalStorage(e, address)}
                      ></i>
                    )}
                  </div>
                </Link>
              </>
            )}
          </React.Fragment>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collections, usage, onClick]
  );

  function removeFromLocalStorage(e, collectionId) {
    e.preventDefault();

    setCollections(prevCollections => {
      const newCollections = prevCollections.filter(collection => collection.collectionId !== collectionId);
      localStorage.setItem("clickedCollections", JSON.stringify(newCollections || []));
      return newCollections;
    });
  }
  function addToLocalStorage(e, image, collectionId, name, openseaVerificationStatus, isAddress) {
    const i = document.querySelector(".searchbar-collection-remove");
    if (e.target === i) return;
    removeCollections(null, true);

    let clickedCollections = localStorage.getItem("clickedCollections") || false;
    let collectionObject;

    const time = new Date().getTime();

    if (clickedCollections) {
      clickedCollections = JSON.parse(clickedCollections);
      clickedCollections = clickedCollections.filter(collection => collection.collectionId !== collectionId);

      if (clickedCollections.length >= 5) {
        clickedCollections.shift();
      }

      collectionObject = JSON.stringify([
        ...clickedCollections,
        {
          image,
          collectionId,
          name,
          openseaVerificationStatus,
          time,
          isLocaleStorage: true,
          isAddress,
        },
      ]);
    } else {
      collectionObject = JSON.stringify([
        {
          image,
          collectionId,
          name,
          openseaVerificationStatus,
          time,
          isLocaleStorage: true,
          isAddress,
        },
      ]);
    }

    localStorage.setItem("clickedCollections", collectionObject);
  }
  function loadCollections(check) {
    if ((collections.length === 0 && text.length === 0) || !check) {
      let collections = localStorage.getItem("clickedCollections") || false;

      if (collections) {
        collections = JSON.parse(collections);

        if (!isHeader) collections = collections.filter(collection => !collection?.isAddress);

        collections.sort((a, b) => b.time - a.time);
        setCollections(collections);
      } else {
        setCollections([]);
      }
    }
  }

  return (
    <>
      <div className="ethereumsearch-container input-lens-container">
        <i className="fa-solid fa-magnifying-glass lens"></i>
        <input
          type="text"
          className={`search-bar ${inLogin && "login-searchbar"}`}
          placeholder={`Search collection${isHeader ? ", address, ens" : ""}`}
          onChange={({ target }) => setText(target.value)}
          onClick={() => loadCollections(true)}
        ></input>

        {loadingCollections ? (
          <div className={`container ${inLogin && "login-search-container"}`}>
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
              <div className="search-skeleton-row">
                <Skeleton circle={true} width={30} height={30} count={5} />
                <Skeleton height={30} count={5} />
              </div>
            </SkeletonTheme>
          </div>
        ) : (
          collections.length > 0 && (
            <div className={`container ${inLogin && "login-search-container"} ${usage === "sniperBot" && "bots"}`}>
              {memoList}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default EthereumSearch;
