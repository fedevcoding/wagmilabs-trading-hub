import React, {useState} from 'react'
import "./login.css"
import wagmiLogo from "../../assets/logo.png"
import SignMessage from "./SignMessage"
import instructionsLogo from "../../assets/instructions.png"

import baseUrl from '../../variables/baseUrl';


import "@rainbow-me/rainbowkit/styles.css";
import { useAccount, useSignMessage } from 'wagmi'



const message = `Welcome to Wagmi Labs!

Please sign this message to log in.
This won't cost you any ETH!

By signing, you accept WagmiLabs' Terms of Service, which you can find here: https://wagmilabs.tools

Your authentication status will reset after 24 hours.

If you're connecting a hardware wallet, you'll need to sign the message on your device, too.`

const Login = ({setConnected}) => {

    const { address } = useAccount()

    const { signMessage } = useSignMessage({
        onError(err){
            if(err?.toString()?.includes("rejected")) setMessage("User rejected signature.")
            else setMessage("Something went wrong, please retry.")
        },
        onSuccess(signature) {
            
            async function checkSignature(){

                try{
                    setMessage("Checking your assets...")

                    const options = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({address, signature, message}),
                        credentials: "include"
                    };
                    
                    let res = await fetch(`${baseUrl}/login`, options)

                    res = await res.json()
                    

                    const {authenticated, token} = res || {}

                    if(authenticated && token){
                        localStorage.setItem("jsonwebtoken", token)
                        setConnected(true)
                    }
                    else{
                        setMessage(res?.message)
                    }
                }
                catch(e){
                    setMessage("Something went wrong, please retry.")
                }
            }
            checkSignature()
        }
    })



    const [messageText, setMessage] = useState("Please connect your wallet to access the NFT tool.")
    const [walletConnected, setWalletConnected] = useState(false)


  return (
    <>
        <div>
            <header className='header'>
                <img className='wagmi-title' alt="" src={wagmiLogo}/>
                <h1 className='header-title'>Wagmi Labs Trading Hub</h1>
                
                <SignMessage setConnected={setConnected} setMessage={setMessage} setWalletConnected={setWalletConnected}/>

            </header>
        </div>

        <div>
            <div className='check-text-container'>
                <p className='check-text'>{messageText}</p>
                {walletConnected && <button onClick={() => signMessage({message})}>Sign message</button>}
            </div>
            
            <a className="instructions-btn" href='https://docs.wagmilabs.tools/tradinghub/' target={"_blank"}>
                <img className='instructions-img' alt="" src={instructionsLogo}/>
                <div>instructions</div>
            </a>
        </div>
    </>
  )
}

export default Login






