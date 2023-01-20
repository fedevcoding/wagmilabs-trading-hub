import React, {useEffect} from 'react'
import { useAccount } from 'wagmi'
// import { useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import logOut from '../utils/functions/logout';

const CheckWalletDisconnect = (props) => {
    
    const { isConnected } = useAccount()


    useEffect(()=>{
        if(!isConnected && props.connected){
            logOut()
        }
    }, [isConnected])


    return (

    <>
    <ConnectButton.Custom>
        {({
            account,
            chain,
            // openAccountModal,
            openChainModal,
            // openConnectModal,
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
                    // logOut()
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