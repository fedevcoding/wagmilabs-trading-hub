import { HStack } from '@chakra-ui/react'
import { PageWrapper } from '@Components'
import React from 'react'


import "./style.scss"


const Wallets = () => {
    return (
        <PageWrapper page="bots-wallets">
            <HStack className='options'>
                <HStack className='wallet' gap={"5px"}>
                    <i className="fa-solid fa-wallet"></i>
                    <p>Wallet</p>
                </HStack>


                <HStack className='actions'>
                    <HStack gap="5px">
                        <i className="fa-solid fa-truck"></i>
                        <p>Transfer</p>
                    </HStack>

                    <HStack gap="5px">
                        <i className="fa-sharp fa-solid fa-upload"></i>
                        <p>Export</p>
                    </HStack>

                    <HStack gap="5px">
                        <i className="fa-solid fa-plus"></i>
                        <p>Add wallet</p>
                    </HStack>
                </HStack>
            </HStack>

            <hr />

            <div className='wallets'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Count</th>
                            <th>Address</th>
                            <th>Balance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                        }
                    </tbody>
                </table>
            </div>

        </PageWrapper>
    )
}

export default Wallets