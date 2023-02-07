import React, { useEffect } from 'react'
import baseUrl from '../variables/baseUrl'
import { useNavigate } from 'react-router-dom'

const RefreshToken = ({ connected, setConnected }) => {
  const navigate = useNavigate()

  async function refreshToken() {
    try {
      let result = await fetch(`${baseUrl}/refresh`, {
        credentials: "include"
      })
      if (!result.ok) throw new Error("error")

      result = await result.json()


      if (result.authenticated) {
        localStorage.setItem("jsonwebtoken", result.token)
        localStorage.setItem("loggedIn", true)
      }
      else {
        navigate("/")
        localStorage.removeItem("jsonwebtoken")
        localStorage.removeItem("loggedIn")
        setConnected(false)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(refreshToken, 20000)

    return () => {
      clearInterval(intervalId)
    }
  }, [connected])


  return (
    <>
    </>
  )
}

export default RefreshToken