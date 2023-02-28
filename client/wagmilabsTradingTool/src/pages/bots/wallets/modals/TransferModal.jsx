import React, { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    HStack,
    NumberInput,
    NumberInputField,
    Select,
} from '@chakra-ui/react'
import { MultiSelect } from 'react-multi-select-component';



const fixedInitialState = {
    value: 0,
    loading: false,
    selectOptions: []
}
const customInitialState = {
    transfers: [
        {
            id: crypto.randomUUID(),
            address: undefined,
            value: undefined,
        }
    ],
}

function fixedReducer(state, action) {
    switch (action.type) {
        case "SET_VALUE":
            return { ...state, value: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_INITIAL_STATE":
            return action.payload;
        case "SET_SELECT_OPTIONS":
            return { ...state, selectOptions: action.payload };
        case "SET_INITIAL_STATE":
            return action.payload;
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
}

function customReducer(state, action) {
    switch (action.type) {
        case "ADD_TRANSFER":
            return { ...state, transfers: [...state.transfers, action.payload] };
        case "REMOVE_TRANSFER":
            return { ...state, transfers: state.transfers.filter((_, i) => i !== action.payload) };
        case "CHANGE_TRANSFER_ADDRESS":
            {
                const { id, newAddress } = action.payload
                const transfers = state.transfers.map((transfer) => {
                    if (transfer.id === id) {
                        return { ...transfer, address: newAddress }
                    }
                    return transfer
                })
                return { ...state, transfers }
            }
        case "CHANGE_TRANSFER_VALUE":
            {
                const { id, newValue } = action.payload
                const transfers = state.transfers.map((transfer) => {
                    if (transfer.id === id) {
                        return { ...transfer, value: newValue }
                    }
                    return transfer
                }
                )
                return { ...state, transfers }

            }
        case "SET_INITIAL_STATE":
            return action.payload;
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
}

export const TransferModal = ({ showTransferModal, toggleModal }) => {

    const [type, setType] = React.useState("fixed");
    const [wallets, setWallets] = React.useState([]);

    // fixed type states
    const [fixedData, dispatchFixed] = React.useReducer(fixedReducer, fixedInitialState)
    const [selectedWallets, setSelectedWallets] = React.useState([])

    // custom type states
    const [customData, dispatchCustom] = React.useReducer(customReducer, customInitialState)


    useEffect(() => {
        const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
        const options = wallets.map(row => ({ label: row.name, value: row.address }));

        dispatchFixed({ type: "SET_SELECT_OPTIONS", payload: options })
        setWallets(wallets)

        return () => {
            setType("fixed")
            dispatchFixed({ type: "SET_INITIAL_STATE", payload: fixedInitialState })
            dispatchCustom({ type: "SET_INITIAL_STATE", payload: customInitialState })
        }
    }, [showTransferModal])



    useEffect(() => {
        console.log(customData)
    }, [customData])


    return (
        <>
            {
                showTransferModal && (
                    <Modal isOpen={true} onClose={() => toggleModal("transfer", false)} isCentered={true}>
                        <ModalOverlay />
                        <ModalContent className='transfer-wallet-modal'>
                            <ModalHeader textAlign={"center"}>
                                <p>Transfer ETH</p>
                            </ModalHeader>

                            <ModalCloseButton />

                            <ModalBody>
                                <div className='form'>
                                    <div className='modal-types'>
                                        <p onClick={() => setType("fixed")} className={`${type === "fixed" && "active"}`}>Fixed</p>
                                        <p onClick={() => setType("custom")} className={`${type === "custom" && "active"}`}>Custom</p>
                                    </div>

                                    <div className='inputs'>

                                        {
                                            type === "fixed" ?
                                                <>
                                                    <p>Wallets</p>
                                                    <MultiSelect options={fixedData.selectOptions} hasSelectAll={true} className="multi-select" value={selectedWallets} onChange={setSelectedWallets} />

                                                    <NumberInput value={fixedData.value}>
                                                        <NumberInputField placeholder="Value (ETH)" onChange={e => dispatchFixed({ type: "SET_VALUE", payload: e.target.value })} />
                                                    </NumberInput>


                                                    <div className='total'>
                                                        <HStack>
                                                            <p>Total wallets:</p>
                                                            <p>{selectedWallets.length}</p>
                                                        </HStack>

                                                        <HStack>
                                                            <p>Total ETH:</p>
                                                            <p>{selectedWallets.length * fixedData.value} ETH</p>
                                                        </HStack>
                                                    </div>
                                                </>
                                                :
                                                type === "custom" ?

                                                    <>
                                                        {
                                                            customData.transfers.map(transfer => {

                                                                const { id } = transfer

                                                                return (
                                                                    <>
                                                                        <HStack>
                                                                            <Select onChange={e => dispatchCustom({ type: "CHANGE_TRANSFER_ADDRESS", payload: { newAddress: e.target.value, id } })}>
                                                                                <option value={undefined} style={{ display: "none" }}>Select wallet</option>
                                                                                {
                                                                                    wallets?.map(row => (
                                                                                        <option value={row.address}>{row.name}</option>
                                                                                    ))
                                                                                }
                                                                            </Select>

                                                                            <NumberInput value={transfer.value}>
                                                                                <NumberInputField placeholder="Value (ETH)" onChange={e => dispatchCustom({ type: "CHANGE_TRANSFER_VALUE", payload: { newValue: e.target.value, id } })} />
                                                                            </NumberInput>
                                                                        </HStack>
                                                                    </>

                                                                )
                                                            })
                                                        }

                                                        <Button onClick={() => dispatchCustom({ type: "ADD_TRANSFER", payload: { value: undefined, address: undefined, id: crypto.randomUUID() } })}>
                                                            <i className="fa-solid fa-plus"></i>
                                                            <p>Add wallet</p>
                                                        </Button>

                                                        <HStack className='alert low-opacity little-text'>
                                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                                            <p>You will be able to export the keys after.</p>
                                                        </HStack>
                                                    </>

                                                    : null
                                        }
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter justifyContent={"center"}>
                                <Button colorScheme='blue' width={"100%"} className={`add-button`}>
                                    {
                                        // loading ?
                                        // <Loader width={"20px"} height={"20px"} />
                                        // :
                                        <p>Transfer</p>
                                    }
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </>
    )
}
