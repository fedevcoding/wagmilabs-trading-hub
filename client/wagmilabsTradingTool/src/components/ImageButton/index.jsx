import React from "react";
import { HStack } from "@chakra-ui/react";
import "./style.scss";

export const ImageButton = ({ value, image, alt, onClick, isSelected, text }) => {
  return (
    <HStack value={value} className={`image-button ${isSelected && "selected"}`} onClick={onClick}>
      <img src={image} alt={alt} />
      <p>{text}</p>
    </HStack>
  );
};
