import React from "react";

import { Button } from "@chakra-ui/react";
import { useSubscribe } from "../../../../custom-hooks/useSubscribe";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Plan = ({ planOption }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { subscribe } = useSubscribe();

  const { planId, months, price } = planOption;

  const buySubscription = async () => {
    setIsLoading(true);
    await subscribe(planId, 1, 0.06);
    setIsLoading(false);
  };

  return (
    <div className="plan-container">
      <div className="plan-header">
        <h3 className="title">{planOption?.name}</h3>
        <p className="price">
          {planOption?.price} ETH {planOption?.price !== 0 && <span className="low-opacity little-text">/ month</span>}
        </p>
      </div>
      <div className="plan-body">
        <p>{planOption?.description}</p>
      </div>
      <div className="plan-footer">
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        size="md"
                        className="btn"
                        width={"100%"}
                        onClick={openConnectModal}
                      >
                        {planOption?.buttonName}
                      </Button>
                    );
                  }
                  return (
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      size="md"
                      className="btn"
                      width={"100%"}
                      onClick={buySubscription}
                    >
                      {planOption?.buttonName}
                    </Button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Plan;
