import { HStack, Button } from '@chakra-ui/react'
import { PageWrapper } from '@Components'
import React from 'react'


import "./style.scss"
import { useManageData, useManageModals } from './hooks'
import { AddModal, ExportModal, TransferModal } from "./modals"


const Wallets = React.memo(() => {

    const clear = () => {

        localStorage.removeItem("wallets")
        remove()
    }

    const { showAddModal, showExportModal, showTransferModal, toggleModal } = useManageModals()
    const { wallets, toggleWallet, remove } = useManageData()

    return (
        <PageWrapper page="bots-wallets">
            <Button onClick={clear}>Clear wallets</Button>

            <div className='modals'>
                <AddModal showAddModal={showAddModal} toggleModal={toggleModal} toggleWallet={toggleWallet} />
                <TransferModal showTransferModal={showTransferModal} toggleModal={toggleModal} />
                <ExportModal showExportModal={showExportModal} />
            </div>


            <HStack className='options'>
                <HStack className='wallet' gap={"5px"}>
                    <i className="fa-solid fa-wallet"></i>
                    <p>Wallets manager</p>
                </HStack>


                <HStack className='actions'>
                    <HStack gap="5px" onClick={() => toggleModal("transfer", true)}>
                        <i className="fa-solid fa-truck"></i>
                        <p>Transfer</p>
                    </HStack>

                    <HStack gap="5px" onClick={() => toggleModal("export", true)}>
                        <i className="fa-sharp fa-solid fa-upload"></i>
                        <p>Export</p>
                    </HStack>

                    <HStack gap="5px" onClick={() => toggleModal("add", true)}>
                        <i className="fa-solid fa-plus"></i>
                        <p>Add wallet</p>
                    </HStack>
                </HStack>
            </HStack>

            <hr />

            <div className='wallets'>
                <table className='table'>
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

                            wallets?.map(wallet => {

                                const key = crypto.randomUUID()
                                const { id } = wallet

                                return (
                                    <tr key={key}>
                                        <td>{wallet.name}</td>
                                        <td>{wallet.count}</td>
                                        <td>{wallet.address}</td>
                                        <td>{wallet.balance}</td>
                                        <td>
                                            <HStack gap="5px" onClick={() => toggleWallet({ id }, false)}>
                                                <i className="fa-solid fa-trash"></i>
                                                <p>Delete</p>
                                            </HStack>
                                        </td>
                                    </tr>

                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </PageWrapper>
    )
})

export default Wallets