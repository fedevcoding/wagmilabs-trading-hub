import React from "react";

import { Button } from "@chakra-ui/react";
import { useSubscribe } from "../../../../custom-hooks/useSubscribe";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader } from "../../../../components/Loader";

const Plan = ({ planOption, durationSelector }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { subscribe } = useSubscribe();

  const monthlyPrice = planOption?.prices[durationSelector?.value];
  const months = durationSelector?.value;

  const { planId, description, buttonName, name } = planOption;

  const buySubscription = async () => {
    setIsLoading(true);
    await subscribe(planId, months, monthlyPrice * months);
    setIsLoading(false);
  };

  return (
    <div className="plan-container">
      <div className="plan-header">
        <h3 className="title">{name}</h3>
        <p className="price">
          {monthlyPrice} ETH{" "}
          {monthlyPrice !== 0 ? (
            <span className="low-opacity little-text">/ month</span>
          ) : (
            <span className="low-opacity little-text">(7 days)</span>
          )}
        </p>
      </div>
      <div className="plan-body">
        <p>{description}</p>
      </div>
      <div className="plan-footer">
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <>
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        size="md"
                        className="btn now-allowed"
                        width={"100%"}
                        borderRadius="20px"
                        // onClick={openConnectModal}
                      >
                        {buttonName}
                      </Button>
                    );
                  }
                  return (
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      size="md"
                      className="btn not-allowed"
                      width={"80%"}
                      height="50px"
                      borderRadius="25px"
                      // onClick={buySubscription}
                    >
                      {isLoading ? <Loader /> : <>{buttonName}</>}
                    </Button>
                  );
                })()}
              </>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Plan;
