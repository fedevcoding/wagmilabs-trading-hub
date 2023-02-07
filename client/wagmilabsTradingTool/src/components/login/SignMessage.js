import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';


const SignMessage = ({ setWalletConnected, setMessage }) => {

    const { isConnected } = useAccount()


    useEffect(() => {
        if (isConnected === true) {
            setWalletConnected(true)
            setMessage("Please sign the message to verify pass ownership.")
        }
        else {
            setWalletConnected(false)
            setMessage("Please connect your wallet to access the NFT tool.")
        }
    }, [isConnected])

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted
                const connected =
                    ready &&
                    account &&
                    chain

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button" className="connect-button">
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button" className="connect-button">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={openAccountModal} type="button" className="connect-button">
                                        {account.displayName}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    )
}

export default SignMessage