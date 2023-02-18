import React from "react";
import "./itemBanner.css";
import { Button, Link } from "@chakra-ui/react";

export const ItemBanner = () => {
  const goToDiscord = () => window.open(`https://discord.gg/wagmilabs`, "_blank");
  return (
    <div
      className="item-banner-container"
    >
        <div className="item-banner-title">DONT FOMO!</div>
        <div className="item-banner-subtitle">Join our Discord for changesto winwhitelist of FREE passes😍</div>
        <Link>
          <Button colorScheme={"white"} className="item-banner-btn" onClick={goToDiscord}>
            LET ME IN!
          </Button>
        </Link>
    </div>
  );
}
