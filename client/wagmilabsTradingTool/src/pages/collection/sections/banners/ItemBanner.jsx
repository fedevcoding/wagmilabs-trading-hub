import React from "react";
import "./itemBanner.css";
import { Button } from "@chakra-ui/react";

export const ItemBanner = ({ primary }) => {
  const subtitle1 = "Join our Discord for chances to win whitelist or FREE passes 😍";
  const subtitle2 = "Join our Discord to NOT miss updates on products and mint!";
  const link = "https://discord.gg/wagmilabs";
  return (
    <a
      className="card"
      href={link}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className="item-banner-container"
      >
        <div className="item-banner-title">DONT FOMO!</div>
        <div className="item-banner-subtitle">{primary ? subtitle1 : subtitle2}</div>
        <Button colorScheme={"white"} className="item-banner-btn">
          LET ME IN!
        </Button>
      </div>
    </a>
  );
}
