import React from "react";
import Twitter from "../../../../assets/twitter.png";
import Discord from "../../../../assets/discord.png";
import Youtube from "../../../../assets/youtube.svg";
import Eventbrite from "../../../../assets/eventbrite.svg";
import LinkIcon from "../../../../assets/link-icon.png";
import "./style.scss";

const matchIcon = type => {
  switch (type) {
    case "twitter":
      return Twitter;
    case "discord":
      return Discord;
    case "youtube":
      return Youtube;
    case "tickets":
      return Eventbrite;
    default:
      return LinkIcon;
  }
};

export const IconLink = ({ type, link }) => (
  <a href={link} target={"_blank"} rel="noreferrer">
    <img src={matchIcon(type)} alt="" width="30px" className="link-img" />
  </a>
);
