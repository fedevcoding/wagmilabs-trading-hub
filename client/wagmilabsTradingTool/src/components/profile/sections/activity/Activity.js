import React, { useEffect, useState } from 'react'
import "./activity.css"
import { roundPrice, formatAddress, dateFormat1, formatAddress2 } from '../../../../utils/formats/formats'

const Activity = ({activityTransactions, setActivityTransactions, userAddress}) => {

  const [newActivityTransactions, setNewActivityTransactions] = useState(null)
  const [filteredActivityTransactions, setFilteredActivityTransactions] = useState(null)

  useEffect(()=>{
    
    async function addNfts(){
      const tokenIds = []
      const contractAddresses = []
      const openseaSorter = []

      activityTransactions.forEach(tx => {
        const {tokenID, contractAddress} = tx
        openseaSorter.push(tokenID)
        tokenIds.push(`&token_ids=${tokenID}`)
        contractAddresses.push(`&asset_contract_addresses=${contractAddress}`)
      })

      const n = 15


      const tokenIdsContainer = new Array(Math.ceil(tokenIds.length / n))
        .fill()
        .map(_ => tokenIds.splice(0, n))
      const contractAddressesContainer = new Array(Math.ceil(contractAddresses.length / n))
        .fill()
        .map(_ => contractAddresses.splice(0, n))
      const openseaSorterContainer = new Array(Math.ceil(openseaSorter.length / n))
        .fill()
        .map(_ => openseaSorter.splice(0, n))

        console.log(tokenIds)
        console.log(tokenIdsContainer)

        let data = [];

        for(let i = 0; i < 10; i ++){
          const testTokenId = tokenIdsContainer[i].join("")
          const testContractAddress = contractAddressesContainer[i].join("")
  
  
          let newData = await fetch(`https://api.opensea.io/api/v1/assets?order_direction=asc&limit=50${testTokenId}${testContractAddress}`)
          newData = await newData.json()

          newData.assets.sort((a, b)  => {
            return openseaSorterContainer[i].indexOf(a.token_id) - openseaSorterContainer[i].indexOf(b.token_id)
          })

          data.push(...newData.assets)
        }

        console.log(data)





        let newActivityTransactions = activityTransactions
        
        newActivityTransactions.forEach((tx, index) => {
          let skip = false;
          let rightData;
          data.forEach(el => {
            if(skip) return
            if(el.token_id == tx.tokenID && el.asset_contract?.address == tx.contractAddress){
              rightData = el
              skip = true
              return
            }
          })
          const merged = {...tx, ...rightData}
          newActivityTransactions[index] = merged
        })
        setNewActivityTransactions(newActivityTransactions)
    }
    activityTransactions && addNfts()
  }, [activityTransactions])

  useEffect(()=>{
    if(newActivityTransactions){
      setFilteredActivityTransactions(newActivityTransactions)
    }
  }, [newActivityTransactions])


  return (
    <>
    <div className='profile-activity-filters'>
      <div className='profile-search-collections'>
        <i className="fa-solid fa-magnifying-glass lens"></i>
        <input type="text" placeholder='Search by name' className='search-collection-item'/>
        <div className='search-result-count'>{filteredActivityTransactions ? filteredActivityTransactions.length : 0} results</div>
      </div>

      <div className='activity-filters'>

        <div className='activity-filter-collection'>

            Collection <i className="fa-solid fa-caret-down activity-collection-arrow"></i>
            <div className='activity-collection-dropdown invisible'>
            
            </div>
        </div>

        <div className='activity-type-filter'>
          Type
          <i className="fa-solid fa-border-all"></i>
        </div>


        <div className='activity-date-filter'>
          Date
          <i className="fa-regular fa-calendar"></i>
        </div>
      </div>

    </div>






      <div className='activity-container'>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Transaction type</th>
              <th>Price</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredActivityTransactions && filteredActivityTransactions.map(tx => {

                const {timeStamp, type, image_url, from, to, name, value, gas, isWeth, } = tx
                return (
                  <tr className='single-activity-container'>
                    <td>
                      <div>
                        <img  style={{width: "50px"}} src={image_url}/>
                        <p>{name}</p>
                      </div>
                    </td>

                    <td>{type}</td>
                    
                    <td>
                      <div>
                        <p>{roundPrice(value)}{isWeth && "(weth)"}</p>
                        <p>(Fee: {roundPrice(gas)})</p>
                      </div>
                    </td>
                    <td><a href={`https://opensea.io/${from}`} target="_blank">{formatAddress2(from, userAddress)}</a></td>
                    <td><a  href={`https://opensea.io/${to}`} target="_blank">{formatAddress2(to, userAddress)}</a></td>
                    <td>{dateFormat1(timeStamp)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Activity
