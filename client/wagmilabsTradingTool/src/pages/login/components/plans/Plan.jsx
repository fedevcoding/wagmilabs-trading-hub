import React from "react";

import { Button } from "@chakra-ui/react";

const Plan = ({ planOption }) => {
  return (
    <div className="plan-container">
      <div className="plan-header">
        <h3>{planOption?.name}</h3>
        <p>{planOption?.price} ETH</p>
      </div>
      <div className="plan-body">
        <p>{planOption?.description}</p>

        <Button>{planOption?.buttonName}</Button>
      </div>
    </div>
  );
};

export default Plan;
