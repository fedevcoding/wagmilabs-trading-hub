import React, { useEffect, useState } from "react";

import { placeholderImage } from "@Utils/images";
import { LazyLoadImage } from "react-lazy-load-image-component";
import image from "@Assets/black-logo.png"

export const BannerSearch = () => {
  const [hiddenBanner, setHiddenBanner] = useState(false);

  useEffect(() => {
    const hidden = sessionStorage.getItem('hideSearchBanner') || false
    setHiddenBanner(hidden)
  }, [])


  const hideSearchBanner = () => {
    sessionStorage.setItem("hideSearchBanner", true);
    setHiddenBanner(true);
  }


  return (
    <>
      {!hiddenBanner ? (
        <a
          className="container-div"
          href="https://www.premint.xyz/WAGMI-Labs/"
          target="_blank"
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
              <p className="searchbar-collection-name">Secure yourself a whitelist!</p>
            </div>
            <p className="searchbar-collection-address">Sign up to premint...</p>
            <i
              className="fa-solid fa-xmark searchbar-collection-remove"
              onClick={() => hideSearchBanner(true)}
            ></i>
          </div>
        </a>
      ) : <></>}</>
  );
}