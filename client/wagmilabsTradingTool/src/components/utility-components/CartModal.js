import React, { useContext } from 'react'
import {Portal} from "react-portal"

import "./cartModal.css"
import {Button} from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../context/userContext'
import emptyCart from '../../utils/database-functions/emptyCart'

const CartModal = ({modalOpen, closeCartModal}) => {
    
    const {userCartItems, setUserCartItems} = useContext(UserDataContext)
    const navigate = useNavigate()
    

    function startExploring(e){
        closeCartModal(e)
        navigate('/')
    }

    async function clearCart(){
        let status = await emptyCart()
        if(status === "success") setUserCartItems([])
    }

    return (
        <>
            {   
            modalOpen &&
                <div className='cart-modal-overlay' onClick={e => closeCartModal(e)}>
                    <div className='cart-modal'>
                        <header className='cart-modal-header'>
                            <div className='modal-cart-your-cart'>
                                <p>Your cart</p>
                                <i class="fa-solid fa-xmark" onClick={e => closeCartModal(e)}></i>
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
                                    {
                                        userCartItems.map((item)=>{
                                            const {name, tokenId, contractAddress, image, price, marketplace} = item
                                            return(
                                                <div className='user-cart-single-item'>
                                                    <img src={image} className="user-cart-item-image"/>
                                                    <div className='user-cart-item-details-container'>
                                                        <p>{name}</p>
                                                        <p>{tokenId}</p>
                                                    </div>
                                                    <div>
                                                        {price}
                                                    </div>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className='empty-cart-section'>
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