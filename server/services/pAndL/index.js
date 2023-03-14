const { execTranseposeAPI } = require("../externalAPI/transpose");

function getNftObj(bought, sold) {
  let nfts = {};
  for (const k in bought) {
    const nft = bought[k];
    const key = (nft.contract_address + ":" + nft.token_id).toLowerCase();
    if (!nfts[key])
      nfts[key] = {
        bought: nft,
      };
  }

  for (const k in sold) {
    const nft = sold[k];
    const key = (nft.contract_address + ":" + nft.token_id).toLowerCase();
    if (nfts[key] && !nfts[key].sold) nfts[key].sold = nft;
  }

  return Object.values(nfts).filter(nft => nft.sold);
}

function getNftMintedObj(minted) {
  let nfts = {};
  for (const k in minted) {
    const nft = minted[k];
    const key = (nft.contract_address + ":" + nft.token_id).toLowerCase();

    const {
      quantity_minted: quantity,
      mint_tx_fee,
      mint_tx_price,
      minted_timestamp: timestamp,
      minted_transaction_hash,
      ...sold
    } = nft;

    if (!nfts[key])
      nfts[key] = {
        sold,
        minted: {
          quantity,
          fee: mint_tx_fee / 10 ** 18,
          price: mint_tx_price ? mint_tx_price / 10 ** 18 : 0,
          timestamp,
          transaction_hash: minted_transaction_hash,
        },
        bought: null,
      };
  }
  return Object.values(nfts);
}

function getPAndLData(nfts, allApprovalGasFees, txsGasFees) {
  return nfts
    .map(nft => {
      const approvalGasFees = allApprovalGasFees[nft.sold.contract_address?.toLowerCase()] ?? 0;
      const soldGasFees = nft.sold.royalty_fee + nft.sold.platform_fee;
      const boughtCoef = nft.bought ? nft.bought.usd_price / nft.bought.eth_price : 0;
      const soldCoef = nft.sold.usd_price / nft.sold.eth_price;
      const soldGasFeesUsd = soldGasFees * soldCoef;
      const approvalGasFeesUsd = approvalGasFees * soldCoef;

      const boughtGasFeesTx = nft.bought ? txsGasFees[nft.bought.transaction_hash.toLowerCase()] ?? 0 : 0;
      const boughtGasFeesTxUsd = boughtGasFeesTx * boughtCoef;

      const mintedFees = nft.minted?.fee || 0;
      const mintedFeesUsd = (nft.minted?.fee || 0) * soldCoef;
      // Calcolo errato, andrebbe usato boughtCoef, ma non abbiamo il prezzo usd nel momento in cui è stato mintato

      const mintedPrice = nft.minted?.price || 0;
      const mintedPriceUsd = (nft.minted?.price || 0) * soldCoef;
      // Calcolo errato, andrebbe usato boughtCoef, ma non abbiamo il prezzo usd nel momento in cui è stato mintato

      const diffInSeconds =
        (new Date(nft.sold.timestamp).getTime() -
          new Date(nft.bought ? nft.bought.timestamp : nft.minted.timestamp).getTime()) /
        1000;

      return {
        ...nft,
        info: {
          nft: {
            address: nft.sold.contract_address,
            id: nft.sold.token_id,
          },
          paid: {
            usd: nft.bought ? nft.bought.usd_price : mintedPriceUsd,
            eth: nft.bought ? nft.bought.eth_price : mintedPrice,
          },
          sold: {
            usd: nft.sold.usd_price,
            eth: nft.sold.eth_price,
          },
          gasFees: {
            paid: {
              royaltyFee: nft.bought?.royalty_fee || 0,
              platformFee: nft.bought?.platform_fee || 0,
              tx: {
                eth: boughtGasFeesTx,
                usd: boughtGasFeesTxUsd,
              },
            },
            sold: {
              royaltyFee: nft.sold.royalty_fee,
              platformFee: nft.sold.platform_fee,
            },
            approval: {
              eth: approvalGasFees,
              usd: approvalGasFeesUsd,
            },
            minted: nft.minted
              ? {
                  eth: mintedFees,
                  usd: mintedFeesUsd,
                }
              : undefined,
            total: {
              eth: soldGasFees + approvalGasFees + boughtGasFeesTx + mintedFees,
              usd: soldGasFeesUsd + approvalGasFeesUsd + boughtGasFeesTxUsd + mintedFeesUsd,
            },
          },
          pOrL: {
            eth:
              nft.sold.eth_price -
              (nft.bought?.eth_price || 0) -
              mintedPrice -
              soldGasFees -
              approvalGasFees -
              boughtGasFeesTx -
              mintedFees,
            usd:
              nft.sold.usd_price -
              (nft.bought?.usd_price || 0) -
              mintedPriceUsd -
              soldGasFeesUsd -
              approvalGasFeesUsd -
              boughtGasFeesTxUsd -
              mintedFeesUsd,
          },
          holdDuration: diffInSeconds,
          gross: {
            eth: nft.sold.eth_price - soldGasFees,
            usd: nft.sold.usd_price - soldGasFeesUsd,
          },
        },
      };
    })
    .sort((a, b) => Date.parse(b.sold.timestamp) - Date.parse(a.sold.timestamp));
}

function formatApprovalGasFees(approvalGasFees) {
  const output = {};
  if (approvalGasFees) {
    for (const value of approvalGasFees) {
      output[value.collection_address.toLowerCase()] = value.approval_gas_fees / 10 ** 18;
    }
  } else {
    console.log("Error approvalGasFees undefined");
  }
  return output;
}

async function getTxsGasFees(nfts) {
  const hashes = [];
  for (const nft of nfts) {
    hashes.push(nft.bought.transaction_hash);
  }

  const query = `
      SELECT transaction_fee, transaction_hash FROM ethereum.transactions
                WHERE transaction_hash IN ('${hashes.join("','")}')`;

  const data = await execTranseposeAPI(query);
  const txsGasFees = {};
  if (data) {
    for (const value of data) {
      txsGasFees[value.transaction_hash.toLowerCase()] = value.transaction_fee / 10 ** 18;
    }
  }
  return txsGasFees;
}

module.exports = {
  getTxsGasFees,
  formatApprovalGasFees,
  getNftObj,
  getNftMintedObj,
  getPAndLData,
};
