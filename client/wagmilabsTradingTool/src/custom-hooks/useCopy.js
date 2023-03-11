import React from "react";
import copy from "copy-to-clipboard";

export function useCopy() {
  const [copyState, setCopyState] = React.useState("Copy");

  const copyAddress = address => {
    copy(address);
    setCopyState("Copied");
    setTimeout(() => {
      setCopyState("Copy");
    }, 400);
  };
  return { copyAddress, copyState };
}
