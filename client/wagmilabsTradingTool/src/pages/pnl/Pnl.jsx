import React, { useState, useEffect } from "react";
import { baseUrl } from "@Variables";
import "./pnl.css";

const Pnl = () => {
  const [tradesItems, setTradesItems] = useState(null);

  // useEffect(()=>{

  // }, [])

  useEffect(() => {
    async function pnlStats() {
      // setPnl(data.PnlObject)
      // setUnrealizedPnl(data.unrealizedPnlObject)
    }
    pnlStats();

    async function getTradeItems() {
      let data = await fetch(`${baseUrl}/profilePnl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.jsonwebtoken,
        },
        body: JSON.stringify({ includePersonalAssets: false }),
      });
      data = await data.json();
      data = data.newTrades;

      let tokenIds = [];
      let contractAddresses = [];
      let sorter = [];

      data.forEach(trade => {
        const tokenId = trade.tokenId;
        const contractAddress = trade.contractAddress;

        sorter.push(tokenId);
        tokenIds.push(`&token_ids=${tokenId}`);
        contractAddresses.push(`&asset_contract_addresses=${contractAddress}`);
      });

      const n = 15;

      const tokenIdsContainer = new Array(Math.ceil(tokenIds.length / n))
        .fill()
        .map(_ => tokenIds.splice(0, n));

      const contractAddressesContainer = new Array(
        Math.ceil(contractAddresses.length / n)
      )
        .fill()
        .map(_ => contractAddresses.splice(0, n));

      const sorterContainer = new Array(Math.ceil(sorter.length / n))
        .fill()
        .map(_ => sorter.splice(0, n));

      let totalTradeItems = [];
      for (let i = 0; i < tokenIdsContainer.length; i++) {
        const tokenIds = tokenIdsContainer[i].join("");
        const contractAddresses = contractAddressesContainer[i].join("");

        // const options = {
        //   method: 'GET',
        //   headers: {Accept: 'application/json', 'X-API-KEY': '2b069923a89d416aa68613d5543306e0'}
        // };
        let data = await fetch(
          `https://api.opensea.io/api/v1/assets?order_direction=asc&limit=50${tokenIds}${contractAddresses}`
        );
        data = await data.json();

        data.assets.sort((a, b) => {
          return (
            sorterContainer[i].indexOf(a.token_id) -
            sorterContainer[i].indexOf(b.token_id)
          );
        });

        totalTradeItems.push(...data.assets);
      }
      data.forEach(trade => {
        const { contractAddress, tokenId } = trade;

        totalTradeItems.forEach(openseaTrade => {
          if (
            contractAddress === openseaTrade?.asset_contract?.address &&
            tokenId === openseaTrade.token_id
          ) {
            trade["name"] = openseaTrade.name;
            trade["image"] = openseaTrade.image_url;
          }
        });
      });
      setTradesItems(data);
    }
    getTradeItems();
  }, []);

  return (
    <div style={{ color: "white" }}>
      <table>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>NFT</th>
            <th>Buy price</th>
            <th>Sell price</th>
            <th>Gas fees</th>
            <th>Pnl</th>
            <th>Approval fees</th>
          </tr>
        </thead>

        <tbody>
          {tradesItems &&
            tradesItems.map(item => {
              const {
                name,
                image,
                buyPrice,
                sellPrice,
                gas,
                flipPnl,
                approvalFee,
              } = item;

              return (
                <tr>
                  <td>
                    <img src={image} className="pnl-img" alt="" />
                    {name}
                  </td>
                  <td>{Math.round(buyPrice * 1000) / 1000}</td>
                  <td>{Math.round(sellPrice * 1000) / 1000}</td>
                  <td>{Math.round(gas * 1000) / 1000}</td>
                  <td>{Math.round(flipPnl * 1000) / 1000}</td>
                  <td>{Math.round(approvalFee * 1000) / 1000}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Pnl;
