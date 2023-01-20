import React, {useEffect} from 'react'
import baseUrl from "../../variables/baseUrl"
import animationBlack from "./animationblack.json"
import Lottie from "react-lottie-player"
import "./checking.css"

const Checking = ({setConnected, setChecking}) => {
    
    
  useEffect(()=>{
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    async function verify(){

      try{
        let res = await fetch(`${baseUrl}/refresh`, {
          credentials: "include"
        })
        res = await res.json()

        await delay(1650)
        if(!res.authenticated){
            localStorage.removeItem("jsonwebtoken")

            window.location.href = "/"
            setConnected(false)
        }
        else{
            localStorage.setItem("jsonwebtoken", res.token)

            setConnected(true)
            setChecking(false)
        }
      }
      catch(e){
        localStorage.removeItem("jsonwebtoken")

        window.location.href = "/"
        setConnected(false)
      }
    }
    setTimeout(verify, 2000)
  }, [])



  return (
    <div className='checking-text' style={{backgroundColor: "black"}}> 
      <Lottie 
        loop
        animationData={animationBlack}
        play
        style={{ width: "25vw", margin: "auto"}}
      />
    </div>
  )
}

export default Checking