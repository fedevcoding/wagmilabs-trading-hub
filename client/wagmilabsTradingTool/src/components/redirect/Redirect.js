import React from 'react'

import notFound from "../../assets/notFound.svg"
import { Button } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import "./redirect.css"

const Redirect = () => {

  const navigate = useNavigate()

  return (
    <div className='page-not-found-container'>
      <p>404: The page you are looking for could not be found</p>
      <img src={notFound}></img>
      <Button onClick={() => navigate("/")}>Take me home</Button>
    </div>
  )
}

export default Redirect