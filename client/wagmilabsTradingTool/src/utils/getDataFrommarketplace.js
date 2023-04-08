const getTokenUrl = (marketplace, tokenId, conractAddress) => {
  switch (marketplace) {
    case "opensea":
      return `https://opensea.io/assets/${conractAddress}/${tokenId}`;
    case "x2y2":
      return `https://x2y2.io/eth/${conractAddress}/${tokenId}`;
    case "looksrare":
      return `https://looksrare.org/collections/${conractAddress}/${tokenId}`;
    case "blur":
      return `https://blur.io/asset/${conractAddress}/${tokenId}`;
    case "sudoswap":
      return `https://sudoswap.xyz/#/browse/buy/${conractAddress}`;
    case "cryptopunks":
      return `https://cryptopunks.app/cryptopunks/details/${tokenId}`;
    case "ens.vision":
      return `https://ens.vision/name/${tokenId}`;
    default:
      return `https://opensea.io/assets/${conractAddress}/${tokenId}`;
  }
};

export { getTokenUrl };
