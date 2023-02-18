import React, {useState} from "react";

import { placeholderImage } from "@Utils/images";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Question from "@Assets/question.png";

export const BannerSearch = () => {
  const hidden = localStorage.getItem('hideSearchBanner');
  const [hiddenBanner, setHiddenBanner] = useState(hidden);

  const hideSearchBanner = () => {
    localStorage.setItem("hideSearchBanner", true);
    setHiddenBanner(true);
  }
  return (
    <>
    {!hiddenBanner ? (
      <div className="container-div">
        <a
          href="https://www.premint.xyz/WAGMI-Labs/"
          target="_blank"
          rel="noreferrer">
          <LazyLoadImage
            visibleByDefault={true}
            src={Question}
            className="collection-image"
            effect="blur"
            placeholderSrc={placeholderImage}
          />
        </a>
        <a
          href="https://www.premint.xyz/WAGMI-Labs/"
          target="_blank"
          rel="noreferrer">
          <div className="searchbar-collection-infos">
            <div className="name-verified-container">
              <p className="searchbar-collection-name">Secure yourself a whitelist!</p>
            </div>
            <p className="searchbar-collection-address">Sign up to Premint...</p>
          </div>
        </a>
        <div className="close-search-banner" onClick={() =>hideSearchBanner()}>
          x
        </div>
      </div>
    ): <></>}</>
  );
}