import React, {useContext, useEffect, useMemo, useState} from 'react'

import "./walletModal.css"

import { UserDataContext } from '../../context/userContext'
import { useAccount, useSigner } from 'wagmi'
import { formatAddress, getFiatPrice, roundPrice } from '../../utils/formats/formats'

import ethereumImage from "../../assets/eth.svg"
import usdcImage from "../../assets/usdc.svg"
import usdtImage from "../../assets/usdt.svg"
import wrappedEthereumImage from "../../assets/weth.svg"


import logOut from '../../utils/functions/logout'
import { Button } from '@chakra-ui/react'
import LivePulsing from './LivePulsing'
import getUserBalances from '../../utils/database-functions/getUserBalances'


// uniswap widget

import { SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'

const jsonRpcUrlMap = { 
  1: ["https://mainnet.infura.io/v3/65b930ca2b6d44f3aca1217115af002e"], 
}

console.warn = function() {}

const theme = {
  primary: '#1F4A05',
  secondary: '#5F7D52',
  interactive: '#CBD6BA',
  container: '#D9ECD9',
  module: '#E9F7DF',
  accent: '#8E8B78',
  outline: '#CADDC2',
  dialog: '#FFF',
  fontFamily: 'Poppins',
  borderRadius: 0.8,
}

const WalletModal = ({walletModalOpen, closeWalletModal}) => {

  const [provider, setProvider] = useState()
  const [swapModal, setSwapModal] = useState(false)

  const {address, connector} = useAccount()
  const {ens, userBalances, profileImage, cryptoPrices, setUserBalances} = useContext(UserDataContext)


  useEffect(()=>{
    getProvider()
  }, [])


  useEffect(() => {
    if(walletModalOpen){
      setTimeout(()=>{
        const modal = document.querySelector(".wallet-modal-container")
        modal.classList.add("visible")
      }, 10)
    }
  
  }, [walletModalOpen])


  function totalBalance(){
    const usd1 = getFiatPrice(userBalances.eth, cryptoPrices.ethPrice)
    const usd2 = getFiatPrice(userBalances.weth, cryptoPrices.ethPrice)
    const usd3 = getFiatPrice(userBalances.usdc, cryptoPrices.usdcPrice)
    const usd4 = getFiatPrice(userBalances.usdt, cryptoPrices.usdtPrice)


    const totalBalance = (Math.round((usd1 + usd2 + usd3 + usd4) * 100) / 100)
    return totalBalance || ""
  }
  

  async function getProvider(){
    const currentProvider = await connector.getProvider()
    setProvider(currentProvider)
  }

  const closeSwapModal = (e) => {
    if(e.target !== e.currentTarget) return
    setSwapModal(false)
  }

  const openSwapModal = () => {
    setSwapModal(true)
  }

  console.log("h2llo")

    return (
    <>
        {
          walletModalOpen &&
          <div onClick={closeWalletModal} className="wallet-modal-overlay">

                {
                  swapModal &&
                  <div className='wallet-swap-overlay' onClick={closeSwapModal}>
                    <div className='wallet-swap-container' onClick={closeSwapModal}>
                      <SwapWidget width={"550px"} theme={theme} provider={provider} jsonRpcUrlMap={jsonRpcUrlMap}/>
                    </div>
                  </div>
                }
                <div className='wallet-modal-container'>
                    <header className="wallet-modal-header">
                      <div className='wallet-modal-address-container'>
                        <img src={profileImage}></img>

                        <div>
                          <p>{formatAddress(address)}</p>
                          <p className='wallet-modal-ens-name'>{ens}</p>
                        </div>
                      </div>

                      <div className='wallet-modal-logout-container' onClick={logOut}>
                        <p>Log out</p>
                        <i className="fa-solid fa-right-from-bracket"></i>
                      </div>
                      
                    </header>
                    <hr className='wallet-modal-hr'/>

                    <div className='wallet-modal-total-balance-container'>
                      <p className='wallet-modal-total-balance-text'>Total balance</p>
                      <p className='wallet-modal-total-balance-value'>${totalBalance()} <LivePulsing></LivePulsing></p>
                    </div>
                    <Button colorScheme={"blue"} className="wallet-modal-add-funds-button" height="50px" display={"block"} borderTopLeftRadius={0} borderTopRightRadius={0}>Add funds</Button>

                    <div className='wallet-modal-currency-container'>
                      <div className='wallet-modal-currency-details'>
                        <div className='wallet-modal-currency-name'>
                          <img src={ethereumImage}/>
                          <p>Ethereum</p>
                        </div>

                        <div className='wallet-modal-crypto-fiat'>
                          <p>{roundPrice(userBalances.eth)}</p>
                          <p className='wallet-modal-usd-currency'>${getFiatPrice(userBalances.eth, cryptoPrices.ethPrice)}</p>
                        </div>

                      </div>
                      <hr className='wallet-modal-hr-2'></hr>

                      <div className='wallet-modal-currency-details'>
                        <div className='wallet-modal-currency-name'>
                          <img src={wrappedEthereumImage}/>
                          <p>Wrapped ethereum</p>
                        </div>

                        <div className='wallet-modal-crypto-fiat'>
                          <p>{roundPrice(userBalances.weth)}</p>
                          <p className='wallet-modal-usd-currency'>${getFiatPrice(userBalances.weth, cryptoPrices.ethPrice)}</p>

                        </div>
                      </div>
                      <hr className='wallet-modal-hr-2'></hr>

                      <div className='wallet-modal-currency-details'>
                        <div className='wallet-modal-currency-name'>
                          <img src={usdcImage}/>
                          <p>USDC</p>
                        </div>

                        <div className='wallet-modal-crypto-fiat'>
                          <p>{roundPrice(userBalances.usdc)}</p>
                          <p className='wallet-modal-usd-currency'>${getFiatPrice(userBalances.usdc, cryptoPrices.usdcPrice)}</p>
                        </div>
                      </div>
                      <hr className='wallet-modal-hr-2'></hr>

                      <div className='wallet-modal-currency-details'>
                        <div className='wallet-modal-currency-name'>
                          <img src={usdtImage}/>
                          <p>USDT</p>
                        </div>

                        <div className='wallet-modal-crypto-fiat'>
                          <p>{roundPrice(userBalances.usdt)}</p>
                          <p className='wallet-modal-usd-currency'>${getFiatPrice(userBalances.usdt, cryptoPrices.usdtPrice)}</p>
                        </div>
                      </div>
                    </div>

                    <Button colorScheme={"teal"} className="wallet-modal-add-funds-button" height="50px" display={"block"} onClick={openSwapModal}>Swap tokens</Button>
                    {/* <Button colorScheme={"teal"} className="wallet-modal-add-funds-button" height="50px" display={"block"} onClick={() => getUserBalances(address, setUserBalances)}>refresh</Button> */}
                </div>
            </div>
        }
    </>
  )
}

export default WalletModal