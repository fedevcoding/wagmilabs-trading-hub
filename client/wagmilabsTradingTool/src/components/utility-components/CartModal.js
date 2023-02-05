import React, { useCallback, useContext, useMemo } from 'react'
import { Portal } from "react-portal"
import notFound from "../../assets/notFound.svg"
import "./cartModal.css"
import { Button } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../context/userContext'
import emptyCart from '../../utils/database-functions/emptyCart'
import { getFiatPrice, roundPrice } from '../../utils/formats/formats'

import { fetchSigner } from "@wagmi/core";
import { getClient } from "@reservoir0x/reservoir-kit-client";
import removeFromCart from '../../utils/database-functions/removeFromCart'



const CartModal = ({ modalOpen, closeCartModal }) => {


    const { userCartItems, setUserCartItems, ethData } = useContext(UserDataContext)
    const navigate = useNavigate()


    function startExploring(e) {
        closeCartModal(e)
        navigate('/')
    }

    async function clearCart() {
        let status = await emptyCart()
        if (status === "success") setUserCartItems([])
    }

    async function removeTokenFromCart(contractAddress, tokenId) {
        const filteredItems = userCartItems.filter(item => item.contractAddress + item.tokenId !== contractAddress + tokenId)

        await removeFromCart(tokenId, contractAddress)

        setUserCartItems(filteredItems)
    }

    const batchBuyItems = async () => {
        const signer = await fetchSigner()

        const tokens = userCartItems.map(item => {
            const { tokenId, contractAddress } = item
            return { tokenId, contract: contractAddress }
        })

        getClient()?.actions.buyToken({
            tokens,
            signer,
            onProgress: (steps) => {
                console.log(steps)
            }
        })
    }


    const totalPrice = useMemo(() => userCartItems.reduce((total, item) => item.price + total, 0), [userCartItems])

    const userCartMapping = useMemo(() => userCartItems.map((item) => {
        const { name, tokenId, contractAddress, image, price, marketplace, collectionName } = item


        return (
            <div className='user-cart-single-item'>
                <img src={image} className="user-cart-item-image" />
                <div className='user-cart-item-details-container'>
                    <p className='user-cart-item-name'>{name}</p>
                    <p className='user-cart-collection-name'>{collectionName}</p>
                </div>
                <div className='user-cart-item-price-container'>

                    <p className='user-cart-item-price'>
                        {roundPrice(price)} ETH
                    </p>

                    <p className='user-cart-item-remove' onClick={() => removeTokenFromCart(contractAddress, tokenId)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </p>
                </div>

            </div>
        )
    }), [userCartItems])

    return (
        <>
            {
                modalOpen &&
                <div className='cart-modal-overlay' onClick={e => closeCartModal(e)}>
                    <div className='cart-modal'>
                        <header className='cart-modal-header'>
                            <div className='modal-cart-your-cart'>
                                <p>Your cart</p>
                                <i className="fa-solid fa-xmark" onClick={e => closeCartModal(e)}></i>
                            </div>
                            <hr className='cart-hr'></hr>
                        </header>


                        {userCartItems.length > 0 ?
                            <div className='cart-items-clearall-container'>
                                <div className='item-clearall'>
                                    <p>{userCartItems.length} item{userCartItems.length > 1 && "s"}</p>
                                    <p className='clear-all-cart' onClick={clearCart}>Clear all</p>
                                </div>
                                <div className='cart-items-container'>
                                    {userCartMapping}
                                </div>

                                <div className='cart-total-buy-container'>
                                    <hr className='cart-buy-now-hr' />

                                    <div className='user-cart-total-price'>
                                        <div>
                                            <p className='user-cart-price-total-price'>Total price:</p>
                                        </div>

                                        <div className='user-cart-price-currencies'>
                                            <p className='user-cart-price-currencies-eth'>{roundPrice(totalPrice)} ETH</p>
                                            <p className='user-cart-price-currencies-usd'>${getFiatPrice(ethData.ethPrice, totalPrice)}</p>
                                        </div>
                                    </div>

                                    <Button className='user-cart-buy-button' colorScheme={"blue"} onClick={batchBuyItems} height="50px">Complete purchase</Button>
                                </div>
                            </div>
                            :
                            <div className='empty-cart-section'>
                                <img src={notFound} className="cart-notfound-img"></img>
                                <p>
                                    Your cart is empty.
                                </p>


                                <Button colorScheme={"blue"} onClick={startExploring} className="cart-start-exploring-button">Start exploring</Button>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default CartModal