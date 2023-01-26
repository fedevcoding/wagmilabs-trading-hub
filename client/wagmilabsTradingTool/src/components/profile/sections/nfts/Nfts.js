import React, {useEffect, useMemo, useState} from 'react'
import baseUrl from '../../../../variables/baseUrl'
import { Portal } from 'react-portal'

// import { useAccount } from 'wagmi'

import Skeleton, {SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import "./nfts.css"

import notFound from "../../../../assets/notFound.svg"


import { getClient } from "@reservoir0x/reservoir-kit-client";
import { roundPrice } from '../../../../utils/formats/formats'
import { marketListingMapping } from '../../../../utils/mappings'
import { fetchSigner } from '@wagmi/core'
import { Tooltip } from '@chakra-ui/react'
import {useDebounce} from "use-debounce"


const sortItemsOptions = [
  { value: 'desc', label: 'Newest' },
  { value: 'asc', label: 'Oldest' },
];


const Nfts = ({nftsCollectionFilter, setNftsCollectionFilter, searchCollectionText, userItems, setProfileImage, collections, loadingNfts, listingSettings, selectedSortOption, setSelectedSortOption, setSearchCollectionText}) => {


    const [confirmListing, setConfirmListing] = useState(null)
    const [selectBulk, setSelectBulk] = useState(false)
    const [bulkItems, setBulkItems] = useState([])
    
    const [showSortItemsOptions, setShowSortItemsOptions] = useState(false);


    function toggleCollectionDropdown(e){
      if (e.target == document.querySelector(".profile-collection-arrow") || e.target == e.currentTarget) {
        document.querySelector(".profile-collection-arrow").classList.toggle("selected")
        document.querySelector(".collection-dropdown").classList.toggle("invisible")
      }
    }

    function closeCollectionDropdown(){
      document.querySelector(".profile-collection-arrow").classList.remove("selected")
      document.querySelector(".collection-dropdown").classList.add("invisible")
    }


    const activateList = (index) => {
      document.querySelectorAll(".profile-list-nft")[index].classList.remove("inactive")
      document.querySelectorAll(".profile-list-nft")[index].classList.add("active")
    }
    
    const deactivateList = (index) => {
      document.querySelectorAll(".profile-list-nft")[index].classList.remove("active")
      document.querySelectorAll(".profile-list-nft")[index].classList.add("inactive")
    }
    
    
    const toggleOptions = (index) => {
      const element = document.querySelectorAll(".single-nft-options")[index]
      if(element.classList.contains("invisible")){
        closeAllOptions()
        element.classList.toggle("invisible")
      }
      else{
        element.classList.toggle("invisible")        
        closeAllOptions()
      }
    }

    const closeAllOptions = ()=> {
      document.querySelectorAll(".single-nft-options").forEach(el => el.classList.add("invisible"))
    }

    const changeBulk = (state) => {
      setSelectBulk(state)
    }


    const changeBulkItems = (contractAddress, tokenId, id, e) => {

      const container = e.target.parentNode.parentNode


      let contains = false
      bulkItems.forEach(item => {
        if(item.id === id) contains = true
      })

      if(contains){
        const filteredBulks = bulkItems.filter(item => item.id != id)
        container.classList.remove("profile-single-item-bulk-selected")
        setBulkItems(filteredBulks)
      }
      else{
        container.classList.add("profile-single-item-bulk-selected")
        setBulkItems(prev => ([...prev, {contractAddress, tokenId, id}]))
      }
    }

    const selectAllBulkItems = () => {
      userItems.forEach((item, index) => {
        const contractAddress = item?.token?.contract
        const tokenId = item?.token?.tokenId

        const id = contractAddress + tokenId
        const e = {target: document.querySelectorAll(".profile-single-item-image")[index]}

        changeBulkItems(contractAddress, tokenId, id, e)
      })
    }
    const clearAllBulkItems = () => {
      setBulkItems([])
      document.querySelectorAll(".profile-single-item-bulk-selected").forEach(el => el.classList.remove("profile-single-item-bulk-selected"))
    }

    async function getListingInfo(tokenId, contractAddress, floorPrice){
      let tokenDetails = {
        approvalFee: 0.00016,
        gas: 0.00016,
        singleBuyPrice: 0.016,
      };
      // for(let i = 0; i < activityTransactions.length; i++){
      //   const tx = activityTransactions[i]
      //   if(tx.contractAddress == contractAddress && tx.tokenId == tokenId){
      //     tokenDetails = tx
      //     break
      //   }
      // }
      const {approvalFee} = tokenDetails
      const gas = tokenDetails.buyGas || tokenDetails.gas
      const singleBuyPrice = tokenDetails.singleBuyPrice || tokenDetails.buyPrice
      // console.log(hash)
      const {marketplace } = listingSettings
      let breakEven = await fetch(`${baseUrl}/breakEven`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken
        },
        body: JSON.stringify({contractAddress, singleBuyPrice, gas, approvalFee, marketplace})
      })
      breakEven = (await breakEven.json()).calculation


      const expirationTime = (new Date((Math.round(Date.now() + 60 * 60 * 24 * 2)))).toString()
      console.log(expirationTime)


      setConfirmListing({breakEven, floorPrice, tokenId, contractAddress, expirationTime})

    }
    
    async function listNft(contractAddress, tokenId, weiPrice){
      const signer = await fetchSigner()
      const marketplace = listingSettings.marketplace
      const expirationTime =  (Math.round(Date.now() / 1000 + 60 * 60 * 24 * 2)).toString()
      const orderbook = marketListingMapping[marketplace].orderbook
      const orderKind = marketListingMapping[marketplace].orderKind
      weiPrice = weiPrice.toString()
  
      getClient()?.actions.listToken({
        listings: [{  
                token: `${contractAddress}:${tokenId}`,
                weiPrice,
                orderbook,
                orderKind,
                expirationTime  
        }],
        signer,
        onProgress: (steps) => {
          console.log(steps)
        }
      })
    }

    useEffect(()=>{
      if(!selectBulk){
        setBulkItems([])
      }
    }, [selectBulk])



    const itemMapping = useMemo(()=> userItems?.map((item, index) => {

          let image = item?.token?.image || "https://www.pngfind.com/pngs/m/2-24050_question-mark-png-image-transparent-white-question-mark.png";
          let name = item?.token?.name

          const rank = 1
          const max_rank = 10
          const contractAddress = item?.token?.contract
          const tokenId = item?.token?.tokenId
    
          const collectionImage = item?.token?.collection?.imageUrl
          const collectionName = item?.token?.collection?.name
          const floor_price = item?.token?.collection?.floorAskPrice
    
          async function updateUserImage(){
    
            let newImage = await fetch(`${baseUrl}/setUserImage`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.jsonwebtoken
              },
              body: JSON.stringify({image_url: image})
            })
            newImage = await newImage.json()
            newImage = newImage.imageUrl
            setProfileImage(newImage)
          }

          const id = contractAddress + tokenId

          return(
              <div className='single-item-container' key={id} onMouseOver={()=> activateList(index)} onMouseOut={()=> deactivateList(index)}>
                  <div className='profile-item-listing'>
                    {item.seaport_sell_orders ? Math.round((item.seaport_sell_orders[0].current_price / 1000000000000000000 * 10000)) / 10000 : <></>}
                  </div>
                <div className={`${selectBulk ? "profile-items-details-container-bulk" : "profile-items-details-container"}`}>
                  <div className='image-hover-overflow'>
                    <img src={image} alt="" className={`profile-single-item-image ${selectBulk ? "single-item-image" : "single-item-image-scale"}`} onClick={(e) => selectBulk && changeBulkItems(contractAddress, tokenId, id, e)}/>
                  </div>

                  <div className="option-button" onClick={()=> toggleOptions(index)}>
                    <i className="fa-regular fa-ellipsis item-option-button"></i>
                    
                    <div className='single-nft-options invisible'>
                      <div onClick={updateUserImage}>
                        <i className="fa-solid fa-image"></i>
                        <p>Set as PFP</p>
                      </div>
                      <div>
                        <i className="fa-solid fa-arrow-up"></i>
                        <p>Transfer</p>
                      </div>
                    </div>
                  </div>

                  {/* <img src={optionButton} className="option-button" onMouseOver={(e)=> uploadInfo(e)} onMouseOut={e=> removeInfo(e)} onClick={updateUserImage}/> */}
                  <a href={`/collection/${contractAddress}`} target="_blank">
                    <Tooltip hasArrow label={collectionName} fontSize='xs' bg="black" color={"white"} placement='top' borderRadius={"7px"}>
                      <img src={collectionImage} alt="" className='profile-item-collection-image'/>
                    </Tooltip>
                  </a>
                  <div className='profile-item-stats'>
                    <div className='profile-item-name-stats'>
                      <p className='single-item-name'>{name || tokenId}</p>
                      {/* <p className='single-item-collection-name'>{collectionName}</p> */}
                      <p className='single-item-rarity'>Floor price: {floor_price && roundPrice(floor_price)}</p>
                    </div>
                    <hr></hr>
                    <div className='profile-list-nft inactive' onClick={() => getListingInfo(tokenId, contractAddress, floor_price)}>
                      <i className="fa-solid fa-tag"></i>
                      <span>Smart list</span>
                    </div>
                  </div>
                </div>
              </div>
          )
    }), [userItems, bulkItems, selectBulk])



    const toggleSortOptions = () => {
      setShowSortItemsOptions(old => !old);
    };


    useEffect(()=>{
      
      const handleClick = (event) => {
        const path = event.composedPath()
        const el1 = document.querySelector(".profile-sort-items")
        const el2 = "item-option-button"
        const el3 = document.querySelector(".profile-filter-collection")

        if(!path.includes(el3)){
          closeCollectionDropdown()
        }

        if(!path.includes(el1)){
          setShowSortItemsOptions(false)
        }

        const classLists = Array.from(event.target.classList)
        console.log(classLists)
        if(!classLists.includes(el2)){
          closeAllOptions()
        }
      }
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [])



    const handleFilterCollection = (collectionAddress, e) => {

      if(collectionAddress?.toLowerCase() === nftsCollectionFilter?.toLowerCase()){
        setNftsCollectionFilter("")
      } 
      else{
        setNftsCollectionFilter(collectionAddress)
      } 
    }



  return (
    <>
    <ListingsSettings confirmListing={confirmListing} setConfirmListing={setConfirmListing} listingSettings={listingSettings} listNft={listNft}/>

    <div className='profile-token-filters'>
      <div className='profile-sort-items-container'>
        <div className='profile-sort-items' onClick={toggleSortOptions}>
          <div className='profile-sort-items-option'>
            {selectedSortOption.label}
            <i className={`fa-solid fa-caret-down profile-collection-sort-arrow ${showSortItemsOptions && "selected"}`}></i>
          </div>

          {
            showSortItemsOptions &&
            <div className="profile-sort-items-options">
              {
                sortItemsOptions.map(option => (
                  <div key={option.value} className="profile-sort-item-single-option" onClick={() => setSelectedSortOption(option)}>
                    {option.label}
                  </div>
                ))
              }
            </div>
          }


        </div>
      </div> 
      
      <div className='profile-filters'> 
        <div className='profile-filter-collection' onClick={(e) => toggleCollectionDropdown(e)}>
            {nftsCollectionFilter?.length > 0 &&
              <p className='collection-filter-indicator'>1</p>
            }
            Collection <i className="fa-solid fa-caret-down profile-collection-arrow"></i>
            <div className='collection-dropdown invisible'>
              
              {collections &&
                <div className='collection-dropdown-search'>
                  <i className="fa-solid fa-magnifying-glass lens"></i>
                  <input type="text" className='collection-dropdown-search'
                    placeholder='Search'
                    value={searchCollectionText}
                    onChange={e => setSearchCollectionText(e.target.value)}
                  />
                </div> 
              }
              {
              collections ?
                collections.length > 0 ?
                  collections.map((collection, index) => {
                    const image = collection?.image_url
                    const name = collection?.name
                    const address = collection?.contract_address

                    return(
                      <div className={`single-collection-dropdown ${address === nftsCollectionFilter && "selected"}`} key={index} active="false" onClick={(e) => handleFilterCollection(address, e)}>
                        <div className='single-collection-dropdown-nameimage'>
                          <img src={image} alt="" />
                          <div>{name}</div>
                        </div>
                        <i className="fa-solid fa-check single-collection-dropdown-check inactive"></i>
                      </div>
                    )
                  }) 
                  :
                  <div className='collection-dropdown-notfound'>
                    No collection found.
                  </div>
                :
                <div className='collection-dropdown-notfound'>
                  Loading collections...
                </div>
              }
          </div>
        </div>
        
        {
          selectBulk ?
          <div className='profile-item-bulk-list-transfer-cancel' onClick={() => changeBulk(false)}>Cancel</div>
          :
          <div className='profile-item-bulk-list-transfer' onClick={() => changeBulk(true)}>Bulk list / transfer</div>
        }
      </div>
    </div>


      {
        loadingNfts ? 
        <div className='profile-skeleton-container'>
            <SkeletonTheme baseColor="#202020" highlightColor="#444" height={"327px"} borderRadius={"10px"}>
              <p>
                  <Skeleton count={14} wrapper={Box}/>
              </p>
            </SkeletonTheme>
        </div>
        :
        <div className='profile-items-container'>
          {
            selectBulk &&
            <>
            <div className='nfts-bulk-information-container'>
              <div>{bulkItems.length} item selected</div>

              <div className='nfts-bulk-information-buttons'>
                {
                bulkItems.length > 0 ?
                <button className='nfts-bulk-information-clear-button' onClick={clearAllBulkItems}>Clear All</button>
                :
                <button className='nfts-bulk-information-select-button' onClick={selectAllBulkItems}>Select All</button>
                }
                <button className='nfts-bulk-information-list-button'>List</button>
                <button className='nfts-bulk-information-transfer-button'>Transfer</button>
              </div>
            </div>
            <hr className='nfts-bulk-information-hr'/>
            </>
          }

            {
            userItems.length === 0 ?

            <div className='profile-user-no-items'>
              <img src={notFound}></img>
              <p>No NFTs found.</p>
            </div>
            :
            <div className="profile-items">
              {itemMapping}
            </div>
            }

        </div>
      }
    </>
  )
}


const Box = ({children}) => {
  return(
    <span>
      {children}
    </span>
  )
}




const ListingsSettings = ({confirmListing, setConfirmListing, listingSettings, listNft}) => {
  
  return(
    <>
    {
      confirmListing && 
      <Portal>
        <div className='bg-modal'></div>
        <section className='nft-listing-modal'>
          <br/>
          <br/>
          You are going to list your nft at {confirmListing.breakEven / 1000000000000000000} on {listingSettings.marketplace.toUpperCase()}
          <br/>
          <br/>
          Collection floor price: {confirmListing.floorPrice}
          <br/>
          <br/>
          Listing will expire: {confirmListing.expirationTime}
          <br/>
          <br/>
          <button onClick={() => {
            listNft(confirmListing.contractAddress, confirmListing.tokenId, confirmListing.breakEven)
          }}>Confirm</button>
          <button onClick={() => setConfirmListing(null)}>Cancel</button>
        </section>
      </Portal>
      }
    </>
  )
}
export default Nfts