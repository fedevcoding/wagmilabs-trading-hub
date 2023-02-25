import React, { useEffect, useState } from "react";

import { Button, Checkbox } from "@chakra-ui/react";

import { useSignMessage, useAccount } from "wagmi";
import { Loader } from "@Components";
import { baseUrl } from "@Variables";

import { useDisconnect } from "wagmi";


import "./style.scss"

const message = `Welcome to Wagmi Labs!

Please sign this message to log in.
This won't cost you any ETH!

By signing, you accept Wagmi Labs' Terms of Service, which you can find here: https://app.wagmilabs.tools/legal

Your authentication status will reset after 24 hours.

If you're connecting a hardware wallet, you'll need to sign the message on your device, too.`;


const SignModal = ({ setConnected, setWalletConnected }) => {

    const { disconnect } = useDisconnect()

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loadingSign, setLoadingSign] = useState(false);


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
                    }
                    setLoadingSign(false);
                } catch (e) {
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


    const disconnectWallet = (e) => {
        if (e.target !== e.currentTarget) return
        setWalletConnected(false)
        disconnect()
    }


    useEffect(() => {
        document.body.classList.add("overflow-hidden")

        return () => {
            document.body.classList.remove("overflow-hidden")

        }
    }, [])

    return (
        <div className="sign-message-container-overlay" onClick={(e) => disconnectWallet(e)}>

            <div className="sign-message-container-box">
                <p className="check-text">Sign in to access the platform</p>

                <div className="sign-in-terms-container">
                    <Checkbox
                        colorScheme={"blue"}
                        borderColor="white"
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

                <Button
                    className={`sign-message-button ${acceptTerms && "active"}`}
                    onClick={callSignMessage}
                >
                    {loadingSign ? (
                        <Loader width={"25px"} height={"25px"} />
                    ) : (
                        "Sign In  "
                    )}
                </Button>
            </div>
        </div>

    );
};

export default SignModal;
