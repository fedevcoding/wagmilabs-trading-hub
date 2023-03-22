import React from "react";
import getMarketplaceImage from "../../../utils/marketplaceImageMapping";
import { Image } from "@Components";

export const MarketplaceImage = React.memo(({ name, alt, className, round, square, width, height, pointer }) => {
  const marketplaceImage = getMarketplaceImage(name);
  return (
    <Image
      src={marketplaceImage}
      alt={alt || name}
      className={className}
      square={square}
      round={round}
      width={width}
      height={height}
      pointer={pointer}
    />
  );
});
