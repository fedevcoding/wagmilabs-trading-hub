import ConnectWallet from "./ConnectWallet";
import React, { useMemo } from "react";


const links = {
    trends: "Trends",
    mints: "Mints",
    bots: "Bots",
    volumes: "Volumes",
    pnl: "P&L",
    feed: "Feed"
}

const Links = ({ setWalletConnected, setMessage, setConnected }) => {
    return (
        <div className="links-container">

            {
                useMemo(
                    () => Object.keys(links).map(key => {
                        const text = links[key]
                        return (
                            <ConnectWallet
                                setConnected={setConnected}
                                setMessage={setMessage}
                                setWalletConnected={setWalletConnected}
                                text={text}
                                value={key}
                            />
                        )
                    }), [])

            }
        </div>
    )
        ;
};

export default Links;
