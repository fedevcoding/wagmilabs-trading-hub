import React, {useEffect} from 'react'
import baseUrl from '../variables/baseUrl'
import { useNavigate } from 'react-router-dom'

const RefreshToken = ({connected, setConnected}) => {
    const navigate = useNavigate()

    async function refreshToken(){
        let result = await fetch(`${baseUrl}/refresh`, {
          credentials: "include"
        })
        result = await result.json()
        if(result.authenticated){
            localStorage.setItem("jsonwebtoken", result.token)
            localStorage.setItem("loggedIn", true)
            // setConnected(true)
        }
        else{
          navigate("/")
          localStorage.removeItem("jsonwebtoken")
          localStorage.removeItem("loggedIn")
          setConnected(false)
        }
      }
    
      useEffect(()=>{
        const intervalId = setInterval(refreshToken, 5000)

        return () =>{
            clearInterval(intervalId)
        }
      }, [connected])
    

  return (
    <>
    </>
  )
}

export default RefreshToken