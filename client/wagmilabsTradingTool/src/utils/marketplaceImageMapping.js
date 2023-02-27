import opensea from "@Assets/opensea.svg";
import x2y2 from "@Assets/x2y2.svg";
import looksrare from "@Assets/looksrare.svg";
import sudoswap from "@Assets/sudoswap.svg";
import blur from "@Assets/blur.png";
import cryptopunks from "@Assets/cryptopunks.svg";
import ensvision from "@Assets/ensvision.svg";
import gem from "@Assets/gem.png";

const getMarketplaceImage = marketplaceName => {
  marketplaceName = marketplaceName?.toString();
  marketplaceName = marketplaceName?.toLowerCase();

  switch (marketplaceName) {
    case "opensea":
      return opensea;
    case "x2y2":
      return x2y2;
    case "looksrare":
      return looksrare;
    case "blur":
      return blur;
    case "blur.io":
      return blur;
    case "sudoswap":
      return sudoswap;
    case "cryptopunks":
      return cryptopunks;
    case "ens.vision":
      return ensvision;
    case "opensea.io":
      return opensea;
    case "x2y2.io":
      return x2y2;
    case "looksrare.org":
      return looksrare;
    case "sudoswap.xyz":
      return sudoswap;
    case "gem.xyz":
      return gem;
    default:
      break;
  }
};

export default getMarketplaceImage;
