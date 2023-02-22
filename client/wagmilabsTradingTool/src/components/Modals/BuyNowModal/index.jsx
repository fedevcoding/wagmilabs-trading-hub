import React, { useState, useContext } from "react";
import getMarketplaceImage from "@Utils/marketplaceImageMapping";
import { Button } from "@chakra-ui/react";
import { Loader } from "@Components";
import { getFiatPrice } from "@Utils/formats/formats";
import { UserDataContext } from "@Context";

import "./style.scss";

export const BuyNowModal = ({
  showBuyNowModal,
  buyNowModalData,
  buyNow,
  closeBuynowModal,
  quantity = null,
}) => {
  const [buying, setBuying] = useState(false);
  const { cryptoPrices } = useContext(UserDataContext);

  const buyNowHandler = async () => {
    if (buying) return;

    try {
      setBuying(true);
      const { contract, tokenId, value } = buyNowModalData;
      await buyNow(contract, tokenId, value);
      setBuying(false);
    } catch (err) {
      setBuying(false);
    }
  };

  return (
    <>
      {showBuyNowModal && (
        <div
          className="buynow-modal-overlay"
          onClick={e => closeBuynowModal(e)}
        >
          <div className="buynow-modal">
            <header className="buynow-modal-header">
              <p>Checkout</p>
              <i
                className="fa-regular fa-xmark"
                onClick={e => closeBuynowModal(e)}
              />
            </header>

            <div className="buynow-modal-body">
              <div className="buynow-modal-token-details">
                <img src={buyNowModalData.image} alt="" />

                <div>
                  <p>{buyNowModalData.name}</p>
                  <p className="low-opacity little-text">
                    {buyNowModalData.collectionName}
                  </p>
                </div>
              </div>

              <hr></hr>

              <div className="space-between">
                <p>Price:</p>

                <div className="buy-now-modal-currency-container">
                  <div className="buy-now-modal-ethereum-price">
                    <i className="fa-brands fa-ethereum"></i>
                    <p>{buyNowModalData.price}</p>
                  </div>
                  <p className="low-opacity little-text">
                    ${" "}
                    {getFiatPrice(buyNowModalData.price, cryptoPrices.ethPrice)}
                  </p>
                </div>
              </div>

              {(quantity && (
                <>
                  <div className="space-between">
                    <p>Quantity:</p>

                    <div className="buy-now-modal-currency-container">
                      {quantity}
                    </div>
                  </div>

                  <hr />

                  <div className="space-between">
                    <p>Total:</p>

                    <div className="buy-now-modal-currency-container">
                      <div className="buy-now-modal-ethereum-price">
                        <i className="fa-brands fa-ethereum"></i>
                        <p>
                          {parseFloat(
                            (
                              buyNowModalData.price * parseInt(quantity)
                            ).toFixed(12)
                          )}
                        </p>
                      </div>
                      <p className="low-opacity little-text">
                        ${" "}
                        {parseFloat(
                          (
                            getFiatPrice(
                              buyNowModalData.price,
                              cryptoPrices.ethPrice
                            ) * parseInt(quantity)
                          ).toFixed(12)
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )) ||
                ""}
              <Button
                colorScheme={"blue"}
                className="buynow-modal-button"
                onClick={async e => {
                  await buyNowHandler();
                  closeBuynowModal(e, true);
                }}
              >
                {!buying ? (
                  <div className="buynow-modal-marketplace">
                    <img
                      className="buynow-modal-marketplace"
                      src={getMarketplaceImage(buyNowModalData.marketplace)}
                      alt=""
                    />
                    <p>Buy now</p>
                  </div>
                ) : (
                  <Loader width="20px" height="20px" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
