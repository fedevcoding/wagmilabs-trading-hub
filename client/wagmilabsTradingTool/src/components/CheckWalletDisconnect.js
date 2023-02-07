import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';


const CheckWalletDisconnect = () => {

    return (

        <>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    // openAccountModal,
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
                                    openConnectModal()
                                    return (
                                        <></>
                                    );
                                }

                                if (chain.unsupported) {
                                    openChainModal()
                                    return (
                                        <></>
                                    );
                                }

                                return (
                                    <></>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </>
    )
}

export default CheckWalletDisconnect