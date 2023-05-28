import React, { useContext, useMemo } from "react";
import { notFound } from "@Assets";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "@Context";
import emptyCart from "@Utils/database-functions/emptyCart";
import { getFiatPrice, roundPrice } from "@Utils/formats/formats";
import { useBuyNow } from "@Hooks";
import { useRemoveItemFromCart } from "@Hooks";

import "./style.css";
import { Loader } from "@Components";

export const CartModal = ({ modalOpen, closeCartModal }) => {
  const toast = useToast();
  const { userCartItems, setUserCartItems, ethData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const { batchBuyNow } = useBuyNow();
  const { removeItemFromCart } = useRemoveItemFromCart();
  const [buyLoading, setBuyLoading] = React.useState(false);

  function startExploring(e) {
    closeCartModal(e);
    navigate("/");
  }

  async function clearCart() {
    try {
      let status = await emptyCart();
      if (status === "success") setUserCartItems([]);
      else throw new Error("error");
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong, try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function batchBuyItems() {
    try {
      setBuyLoading(true);
      const listingIds = userCartItems.map(item => {
        return item?.listingId;
      });
      await batchBuyNow(listingIds, totalPrice);
    } catch (e) {
    } finally {
      setBuyLoading(false);
    }
  }

  const totalPrice = useMemo(() => userCartItems.reduce((total, item) => item.price + total, 0), [userCartItems]);

  const userCartMapping = useMemo(
    () =>
      userCartItems.map(item => {
        const { name, tokenId, contractAddress, image, price, collectionName, listingId } = item;

        return (
          <div className="user-cart-single-item" key={contractAddress + tokenId + listingId}>
            <img src={image} className="user-cart-item-image" alt="" />
            <div className="user-cart-item-details-container wrap-text">
              <p className="user-cart-item-name wrap-text">{name}</p>
              <p className="user-cart-collection-name wrap-text">{collectionName}</p>
            </div>
            <div className="user-cart-item-price-container">
              <p className="user-cart-item-price big-text">{roundPrice(price)} ETH</p>

              <p
                className="user-cart-item-remove"
                onClick={() => removeItemFromCart(tokenId, contractAddress, listingId)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </p>
            </div>
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userCartItems]
  );

  return (
    <>
      {modalOpen && (
        <div className="cart-modal-overlay" onClick={e => closeCartModal(e)}>
          <div className="cart-modal">
            <header className="cart-modal-header">
              <div className="modal-cart-your-cart">
                <p>Your cart</p>
                <i className="fa-solid fa-xmark" onClick={e => closeCartModal(e)}></i>
              </div>
              <hr className="cart-hr"></hr>
            </header>

            {userCartItems.length > 0 ? (
              <div className="cart-items-clearall-container">
                <div className="item-clearall">
                  <p>
                    {userCartItems.length} item{userCartItems.length > 1 && "s"}
                  </p>
                  <p className="clear-all-cart" onClick={clearCart}>
                    Clear all
                  </p>
                </div>
                <div className="cart-items-container">{userCartMapping}</div>

                <div className="cart-total-buy-container">
                  <hr className="cart-buy-now-hr" />

                  <div className="user-cart-total-price">
                    <div>
                      <p className="user-cart-price-total-price">Total price:</p>
                    </div>

                    <div className="user-cart-price-currencies">
                      <p className="user-cart-price-currencies-eth">{roundPrice(totalPrice)} ETH</p>
                      <p className="user-cart-price-currencies-usd">${getFiatPrice(ethData.ethPrice, totalPrice)}</p>
                    </div>
                  </div>

                  <Button className="user-cart-buy-button" colorScheme={"blue"} onClick={batchBuyItems} height="50px">
                    {buyLoading ? <Loader /> : <p>Complete purchase</p>}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="empty-cart-section">
                <img src={notFound} className="cart-notfound-img" alt="" />
                <p>Your cart is empty.</p>

                <Button colorScheme={"blue"} onClick={startExploring} className="cart-start-exploring-button">
                  Start exploring
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
