import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ConnectWallet = ({ setWalletConnected, isHeader }) => {
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected === true) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        mounted,
      }) => {
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
                  <div className={`connect-wallet-container ${!isHeader && "not-header"}`} onClick={openConnectModal}>
                    <i className="fa-solid fa-wallet"></i>
                    <button
                      type="button"
                      className="connect-button"
                    >
                      Connect Wallet
                    </button>
                  </div>
                );
              }
              return (
                <div className={`connect-wallet-container ${!isHeader && "not-header"}`}>
                  <i className="fa-solid fa-wallet"></i>
                  <button
                    type="button"
                    className="connect-button"
                  >
                    Connected!
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
