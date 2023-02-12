import React, { useState } from "react";
import "./login.css";
import wagmiLogo from "../../assets/logo.png";
import SignMessage from "./SignMessage";
import instructionsLogo from "../../assets/instructions.png";

import baseUrl from "../../variables/baseUrl";

import "@rainbow-me/rainbowkit/styles.css";
import { useAccount, useSignMessage } from "wagmi";
import { Button, Checkbox } from "@chakra-ui/react";

import wwwImg from "../../assets/www.svg";
import twitterImg from "../../assets/twitter2.svg";
import discordImg from "../../assets/discord2.svg";
import { Loader } from "@Components";

const message = `Welcome to Wagmi Labs!

Please sign this message to log in.
This won't cost you any ETH!

By signing, you accept Wagmi Labs' Terms of Service, which you can find here: https://app.wagmilabs.tools/legal

Your authentication status will reset after 24 hours.

If you're connecting a hardware wallet, you'll need to sign the message on your device, too.`;

const Login = ({ setConnected }) => {
  const [messageText, setMessage] = useState(
    "Please connect your wallet to access the NFT tool."
  );
  const [walletConnected, setWalletConnected] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);

  const { address } = useAccount();

  const { signMessage } = useSignMessage({
    onError(err) {
      setLoadingSign(false);
      if (err?.toString()?.includes("rejected"))
        setMessage("User rejected signature.");
      else setMessage("Something went wrong, please retry.");
    },
    onSuccess(signature) {
      async function checkSignature() {
        try {
          setMessage("Checking your assets...");

          const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, signature, message }),
            credentials: "include",
          };

          let res = await fetch(`${baseUrl}/login`, options);

          res = await res.json();

          const { authenticated, token } = res || {};

          if (authenticated && token) {
            localStorage.setItem("jsonwebtoken", token);
            setConnected(true);
          } else {
            setMessage(res?.message);
          }
          setLoadingSign(false);
        } catch (e) {
          setLoadingSign(false);
          setMessage("Something went wrong, please retry.");
        }
      }
      checkSignature();
    },
  });

  const callSignMessage = () => {
    if (!loadingSign) {
      setLoadingSign(true);
      signMessage({ message });
    }
  };

  function changeAccept(e) {
    setAcceptTerms(e.target.checked);
  }

  return (
    <>
      <div>
        <header className="header">
          <img className="wagmi-title" alt="" src={wagmiLogo} />
          <h1 className="header-title">Wagmi Labs Trading Hub</h1>

          <SignMessage
            setConnected={setConnected}
            setMessage={setMessage}
            setWalletConnected={setWalletConnected}
          />
        </header>
      </div>

      <div>
        {walletConnected ? (
          <>
            <div className="sign-message-container-box">
              <p className="check-text">{messageText}</p>
              <div className="sign-in-terms-container">
                <Checkbox
                  colorScheme={"blue"}
                  borderColor="black"
                  className="accept-terms"
                  onChange={e => changeAccept(e)}
                >
                  I have read and accept the{" "}
                  <a
                    href="/legal"
                    target={"_blank"}
                    className="legal-terms-link"
                  >
                    legal terms
                  </a>
                </Checkbox>
              </div>
              {walletConnected && (
                <Button
                  className={`sign-message-button ${acceptTerms && "active"}`}
                  onClick={callSignMessage}
                >
                  {loadingSign ? (
                    <Loader width={"25px"} height={"25px"} />
                  ) : (
                    "Sign message"
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="check-text-container">
            <p className="check-text">{messageText}</p>
          </div>
        )}

        <div className="login-general-links">
          <div className="login-general-links-line"></div>

          <a target="_blank" href="https://wagmilabs.tools" rel="noreferrer">
            <img src={wwwImg} className="login-general-links-img" alt="" />
          </a>
          <a
            target="_blank"
            href="https://twitter.com/wagmi_labs"
            rel="noreferrer"
          >
            <img src={twitterImg} className="login-general-links-img" alt="" />
          </a>
          <a
            target="_blank"
            href="https://discord.gg/PZsVtxdyQu"
            rel="noreferrer"
          >
            <img src={discordImg} className="login-general-links-img" alt="" />
          </a>

          <div className="login-general-links-line"></div>
        </div>

        <a className="legal-btn" href="/legal" target={"_blank"}>
          <img className="legal-img" alt="" src={instructionsLogo} />
          <div>Legal</div>
        </a>

        <a
          className="instructions-btn"
          href="https://docs.wagmilabs.tools/tradinghub/"
          target={"_blank"}
          rel="noreferrer"
        >
          <img className="instructions-img" alt="" src={instructionsLogo} />
          <div>instructions</div>
        </a>
      </div>
    </>
  );
};

export default Login;
