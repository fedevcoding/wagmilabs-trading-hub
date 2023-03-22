import { HStack } from "@chakra-ui/react";
import React from "react";

const EthLogo = ({ size, lowOpacity, className, text }) => {
  return (
    <HStack className={`${lowOpacity && "low-opacity"}`} style={{ fontSize: size || "16px" }}>
      {(text || text === 0) && <p>{text}</p>}
      <i className={`fa-brands fa-ethereum`}></i>
    </HStack>
  );
};

export default EthLogo;
