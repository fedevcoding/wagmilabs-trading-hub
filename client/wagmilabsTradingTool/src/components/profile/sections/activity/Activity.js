import React, { useEffect, useState } from 'react'
import "./activity.css"
import { roundPrice, formatAddress, dateFormat1, formatAddress2 } from '../../../../utils/formats/formats'
import baseUrl from '../../../../variables/baseUrl'

const Activity = ({}) => {

  useEffect(()=>{
    fetchActivity()
  }, [])

  async function fetchActivity(){
    const response = await fetch(`${baseUrl}/profileActivity`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken,
      }
    })

    const activity = await response.json()
    console.log(activity)
  }
  return (
    <>
    </>
  )
}

export default Activity
