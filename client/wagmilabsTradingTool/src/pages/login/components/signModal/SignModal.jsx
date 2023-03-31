import React, { useEffect, useState } from "react";

import { Button, Checkbox } from "@chakra-ui/react";

import { useSignMessage, useAccount } from "wagmi";
import { Loader } from "@Components";
import { baseUrl } from "@Variables";

import "./style.scss";

const message = `Welcome to Wagmi Labs!

Please sign this message to log in.
This won't cost you any ETH!

By signing, you accept Wagmi Labs' Terms of Service, which you can find here: https://app.wagmilabs.tools/legal

Your authentication status will reset after 24 hours.

If you're connecting a hardware wallet, you'll need to sign the message on your device, too.`;

const SignModal = ({ setConnected, setSignIn }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasError, setHasError] = useState(false);

  const { address } = useAccount();

  const { signMessage } = useSignMessage({
    onError(err) {
      setLoadingSign(false);
    },
    onSuccess(signature) {
      async function checkSignature() {
        try {
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
            if (window.location.pathname !== "/") window.location.href = "/";
          } else {
            setHasError(true);
            setErrorMessage(res.message);
          }
        } catch (e) {
          setHasError(true);
          setErrorMessage("Something went wrong, please try again later");
        } finally {
          setLoadingSign(false);
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

  const disconnectWallet = e => {
    if (e.target !== e.currentTarget) return;
    setSignIn(false);
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const goToPlans = () => {
    setSignIn(false);
    const planSection = document.querySelector(".plans-section");
    planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="sign-message-container-overlay" onClick={e => disconnectWallet(e)}>
      <div className="sign-message-container-box">
        {!hasError ? (
          <>
            <p className="check-text">Sign in to access the platform</p>

            <div className="sign-in-terms-container">
              <Checkbox
                colorScheme={"blue"}
                borderColor="white"
                className="accept-terms"
                onChange={e => changeAccept(e)}
              >
                I have read and accept the{" "}
                <a href="/legal" target={"_blank"} className="legal-terms-link">
                  legal terms
                </a>
              </Checkbox>
            </div>

            <Button className={`sign-message-button ${acceptTerms && "active"}`} onClick={callSignMessage}>
              {loadingSign ? <Loader width={"25px"} height={"25px"} /> : "Sign In  "}
            </Button>
          </>
        ) : (
          <>
            <p className="check-text">Login failed</p>

            <p className="login-error">{errorMessage}</p>

            {errorMessage.includes("not have") && (
              <Button className={`sign-message-button ${"active"}`} onClick={goToPlans}>
                Plans
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignModal;
