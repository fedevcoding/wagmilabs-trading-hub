import opensea from "../assets/opensea.svg"
import x2y2 from "../assets/x2y2.svg"
import looksrare from "../assets/looksrare.svg"
import sudoswap from "../assets/sudoswap.svg"
import blur from "../assets/blur.png"
import cryptopunks from "../assets/cryptopunks.svg"
import ensvision from "../assets/ensvision.svg"
import gem from "../assets/gem.png"




const getMarketplaceImage = (marketplaceName) => {

        marketplaceName = marketplaceName?.toString()
        marketplaceName = marketplaceName?.toLowerCase()

        switch(marketplaceName){
            case "opensea":
                return opensea
            case "x2y2":
                return x2y2
            case "looksrare":
                return looksrare
            case "blur":
                return blur
            case "blur.io":
                return blur
            case "sudoswap":
                return sudoswap
            case "cryptopunks":
                return cryptopunks
            case "ens.vision":
                return ensvision
            case "opensea.io":
                return opensea
            case "x2y2.io":
                return x2y2
            case "looksrare.org":
                return looksrare
            case "sudoswap.xyz":
                return sudoswap
            case "gem.xyz":
                return gem
        }
}


export default getMarketplaceImage