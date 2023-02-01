import React, { useEffect, useMemo, useState } from 'react'
import "./activity.css"
import { roundPrice, formatAddress, dateFormat1, formatAddress2, roundPrice2, formatAddress3, formatIpfs } from '../../../../utils/formats/formats'
import baseUrl from '../../../../variables/baseUrl'
import getMarketplaceImage from '../../../../utils/marketplaceImageMapping'
import moment from 'moment'
import { useAccount } from 'wagmi'
import { Button, HStack, Input, NumberInput, NumberInputField, Select } from '@chakra-ui/react'


const activityTypeMapping = {
  "list": "List",
  "sale": "Sale",
  "buy": "Buy",
  "receive": "Receive",
  "send": "Send",
  "mint": "Mint",
}

const activityMarketplaceMapping = [
  {
    name: "All",
    value: ""
  },
  {
    name: "OpenSea",
    value: "opensea"
  },
  {
    name: "X2Y2",
    value: "x2y2"
  },
  {
    name: "SudoSwap",
    value: "sudoswap"
  },
  {
    name: "LooksRare",
    value: "looksrare"
  },
  {
    name: "Blur",
    value: "blur"
  },
  {
    name: "Rarible",
    value: "rarible"
  },
]

const Activity = ({}) => {
  
  const {address: userAdress} = useAccount()

  const [activityCategory, setActivityCategory] = useState(["sale"])
  const [activityAddressFilter, setActivityAddressFilter] = useState({from: "", to: ""})
  const [activityPriceFilter, setActivityPriceFilter] = useState({min: "", max: ""})
  const [activityMarketplaceFilter, setActivityMarketplaceFilter] = useState("")
  const [activityTokenIdFilter, setActivityTokenIdFilter] = useState("")

  const [profileActivity, setProfileActivity] = useState([])
  const [profileActivityLoading, setProfileActivityLoading] = useState(true)

  const [activityFilters, setActivityFilters] = useState({
    activityCategory,
    activityAddressFilter,
    activityPriceFilter,
    activityMarketplaceFilter,
    activityTokenIdFilter
  })

  useEffect(()=>{
    fetchActivity()
    console.log(activityFilters)
  }, [activityFilters])



  const getAddressFilter = () => {
    const {activityAddressFilter} = activityFilters
    const {from, to} = activityAddressFilter

    let addressFilter = ""


    if(from && to){
      addressFilter = `&fromAddress=${from}&toAddress=${to}`
    }
    else if(from && !to){
      addressFilter = `&fromAddress=${from}`
    }
    else if(!from && to){
      addressFilter = `&toAddress=${to}`
    }
    else{
      addressFilter = ""
    }

    return addressFilter
  }
  const getTypeFilter = () => {
    const {activityCategory} = activityFilters
    let typeUrl = ""

    activityCategory.forEach(item => {
      typeUrl = typeUrl + `&include${item[0].toUpperCase()}${item.slice(1)}=true`
    })
    return typeUrl

  }
  const getPriceFilter = () => {
    const {activityPriceFilter} = activityFilters
    const {min, max} = activityPriceFilter

    let priceFilter = ""

    if(min && max){
      priceFilter = `&minPrice=${min}&maxPrice=${max}`
    }
    else if(min && !max){
      priceFilter = `&minPrice=${min}`
    }
    else if(!min && max){
      priceFilter = `&maxPrice=${max}`
    }
    else{
      priceFilter = ""
    }

    return priceFilter
  }
  const getMarketplaceFilter = () => {
    const {activityMarketplaceFilter} = activityFilters
    const marketplaceFilter = activityMarketplaceFilter ? `&marketplace=${activityMarketplaceFilter}` : ""
    return marketplaceFilter
  }
  const getTokenIdFilter = () => {
    const {activityTokenIdFilter} = activityFilters
    const tokenIdFilter = activityTokenIdFilter ? `&tokenId=${activityTokenIdFilter}` : ""
    return tokenIdFilter
  }



  async function fetchActivity(){
    setProfileActivityLoading(true)

    const addressFilter = getAddressFilter()
    const typeFilter = getTypeFilter()
    const priceFilter = getPriceFilter()
    const marketplaceFilter = getMarketplaceFilter()
    const tokenIdFilter = getTokenIdFilter()


    const response = await fetch(`${baseUrl}/profileActivity?hello=hello${typeFilter}${addressFilter}${priceFilter}${marketplaceFilter}${tokenIdFilter}`, {
      headers: {
        "x-auth-token": localStorage.jsonwebtoken,
      }
    })

    const {activity} = await response.json()
    setProfileActivity(activity)
    setProfileActivityLoading(false)
    console.log(activity)
  }



  function changeActivityCategory(filter){
    if(activityCategory.includes(filter)){
      const newActivityFilter = activityCategory.filter(item => item !== filter)
      setActivityCategory(newActivityFilter)
    }else{
      const newActivityFilter = [...activityCategory, filter]
      setActivityCategory(newActivityFilter)
    }
  }



  function saveActivityFilters(){
    setActivityFilters({activityCategory, activityAddressFilter, activityPriceFilter, activityMarketplaceFilter, activityTokenIdFilter})
  }

  const profileActivityMapping = useMemo(() => profileActivity.map(item => {
    const {type, from_address, marketplace, price, quantity, createdAt, to_address, token_id, transacton_hash} = item || {}
    let {name: tokenName, image: tokenImage} = item?.tokenData?.token || {}
    const {name: collectionName} = item?.tokenData?.token?.collection || {}
    // const {tokenName, tokenImage, tokenId} = item.token
    // const {collectionName, collectionImage} = item.collection
    
    const activityType = activityTypeMapping[type]

    // const marketplaceName = item?.order?.source?.name
    const marketplaceImage = getMarketplaceImage(marketplace)

    const key = crypto.randomUUID()

    if(tokenImage?.includes("ipfs")) tokenImage = formatIpfs(tokenImage)

    return(

      <>
      <tr key={key} className="profile-activity-single-container">
        
        <td className="profile-activity-single-type">
          <div className='profile-activity-marketplace-container'>
            {
              marketplaceImage ?
              <img src={marketplaceImage} className="profile-activity-marketplace-image"></img>
              :
              <ActivityIcon type={type}/>
            }
            {activityType}
          </div>
        </td>
        
        <td className='profile-activity-single-token'>
          <img src={tokenImage} alt="" className="profile-activity-single-image"/>
          <div className='wrap-text'>
            <p className='wrap-text'>{tokenName || token_id}</p>
            <p className='low-opacity little-text wrap-text'>{collectionName}</p>
          </div>
        </td>
        <td className='profile-activity-single-price'>{price ? roundPrice2(price) : 0} ETH</td>
        <td className='profile-activity-single-from'>{from_address ? formatAddress2(from_address, userAdress) : "- - -"}</td>
        <td className='profile-activity-single-to'>{to_address ? formatAddress2(to_address, userAdress) : "- - -"}</td>
        <td className='profile-activity-single-time'>{moment(createdAt).fromNow()}</td>
      </tr>
      
      <tr className='profile-activity-single-hr'>
        <td colSpan={6}>
          <hr></hr>
        </td>
      </tr>
      </>
    )
  }), [profileActivity])
  
  return (
    <>
      <hr className='profile-activity-hr'/>
      <div className='profile-activity-section'>

          <div className='profile-activity-filters-container'>

            <div className='profile-activity-filter-section'>
              <p>CATEGORY</p>

              <div className='profile-activity-filters-categories'>
                <div onClick={() => changeActivityCategory("sale")} className={`${activityCategory.includes("sale") ? "active" : ""}`}>
                  <i className="fa-light fa-bag-shopping"></i>
                  Sales
                </div>
                <div onClick={() => changeActivityCategory("list")} className={`${activityCategory.includes("list") ? "active" : ""}`}>
                  <i className="fa-light fa-tag"></i>
                  Listings
                </div>
              </div>
              <div className='profile-activity-filters-categories'>
                <div onClick={() => changeActivityCategory("mint")} className={`${activityCategory.includes("mint") ? "active" : ""}`}>
                  <i className="fa-solid fa-sparkles"></i>
                  Mints
                </div>
                <div onClick={() => changeActivityCategory("send")} className={`${activityCategory.includes("send") ? "active" : ""}`}>
                  <i className="fa-regular fa-plane-departure"></i>
                  Send
                </div>
              </div>
              <div className='profile-activity-filters-categories'>
                <div onClick={() => changeActivityCategory("receive")} className={`${activityCategory.includes("receive") ? "active" : ""}`}>
                  <i className="fa-light fa-truck"></i>
                  Receive
                </div>
                <div onClick={() => changeActivityCategory("burn")} className={`${activityCategory.includes("burn") ? "active" : ""}`}>
                  <i className="fa-solid fa-fire"></i>
                  Burn
                </div>
              </div>
              <div className='profile-activity-filters-categories'>
                <div onClick={() => changeActivityCategory("buy")} className={`${activityCategory.includes("buy") ? "active" : ""}`}>
                  <i className="fa-light fa-truck"></i>
                  Buy
                </div>
              </div>
            </div>

            <div className='profile-activity-filter-section'>
              <p>ADDDRESSES</p>

              <HStack>
                <Input placeholder="From" value={activityAddressFilter.from} onChange={(e) => setActivityAddressFilter(old => ({...old, from: e.target.value}))}></Input>
                <Input placeholder="To" value={activityAddressFilter.to} onChange={(e) => setActivityAddressFilter(old => ({...old, to: e.target.value}))}></Input>
              </HStack>

            </div>

            <div className='profile-activity-filter-section'>
              <p>PRICE</p>

              <HStack>
                <NumberInput value={activityPriceFilter.min} onChange={(value) => setActivityPriceFilter(old => ({...old, min: value}))}>
                  <HStack>
                    <NumberInputField placeholder="Min" />
                  </HStack>
                </NumberInput>

                <NumberInput value={activityPriceFilter.max} onChange={(value) => setActivityPriceFilter(old => ({...old, max: value}))}>
                  <HStack>
                    <NumberInputField placeholder="Max" />
                  </HStack>
                </NumberInput>
              </HStack>

            </div>

            <div className='profile-activity-filter-section'>
              <p>MARKETPLACE</p>

              <Select value={activityMarketplaceFilter} onChange={(e) => setActivityMarketplaceFilter(e.target.value)}>
                {
                  activityMarketplaceMapping.map((marketplace, index) => (
                    <option key={index} value={marketplace.value}>{marketplace.name}</option>
                  ))
                }
              </Select>
            </div>

            <div className='profile-activity-filter-section'>
              <p>TOKEN ID</p>

              <NumberInput value={activityTokenIdFilter} onChange={(value) => setActivityTokenIdFilter(value)}>
                <HStack>
                  <NumberInputField placeholder="TokenId" />
                </HStack>
              </NumberInput>
            </div>

            <div className='profile-activity-filter-section'>
              <Button width={"100%"} onClick={saveActivityFilters}>Save</Button>
            </div>
          </div>

          <div className='profile-activity-container'>

            <div className='profile-activity-table-container'>
              <table className='profile-activity-table'>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th className='profile-activity-tr-item'>Item</th>
                    <th>Price</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Time</th>
                  </tr>
                </thead>

                
                <tbody>

                  {
                    !profileActivityLoading && profileActivityMapping
                  }
                </tbody>
              </table>
            </div>
          </div>

      </div>
    </>
  )
}

export default Activity





const ActivityIcon = ({type}) => {

  return(
    <>
    {
      (()=> {
        switch(type) {
          case "sale":
            return <i className="fa-light fa-bag-shopping"></i>
          case "buy":
            return <i className="fa-light fa-bag-shopping"></i>
          case "list":
            return <i className="fa-light fa-tag"></i>
          case "receive":
            return <i className="fa-light fa-truck"></i>
          case "send":
            return <i className="fa-light fa-truck"></i>
          case "mint":
            return <i className="fa-solid fa-sparkles"></i>
          default:
            return <i className="fa-solid fa-question"></i>
        }
      })()
    }
    </>
  )
}