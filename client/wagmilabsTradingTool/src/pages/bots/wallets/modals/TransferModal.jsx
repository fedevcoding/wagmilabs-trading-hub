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

const initialState = {
    type: "fixed",
    value: 0,
    wallets: [],
    loading: false,
    selectedWallets: [],
    customWalletsAmount: 1,
    customWallets: []
}

function reducer(state, action) {
    switch (action.type) {
        case "SET_TYPE":
            return { ...state, type: action.payload };
        case "SET_WALLETS":
            return { ...state, wallets: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_INITIAL_STATE":
            return action.payload;
        case "SET_SELECTED_WALLETS":
            return { ...state, selectedWallets: action.payload };
        case "SET_VALUE":
            return { ...state, value: action.payload };
        case "SET_CUSTOM_WALLETS_AMOUNT":
            return { ...state, customWalletsAmount: action.payload };
        case "ADD_CUSTOM_WALLET":
            return { ...state, customWallets: [...state.customWallets, { address: "", amount: 0 }] };
        case "REMOVE_CUSTOM_WALLET":
            return { ...state, customWallets: state.customWallets.filter((row, index) => index !== action.payload) };
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
}

export const TransferModal = ({ showTransferModal, toggleModal }) => {

    const [data, dispatch] = React.useReducer(reducer, initialState)
    const [selectedWallets, setSelectedWallets] = React.useState([]);

    useEffect(() => {
        const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
        const options = wallets.map(row => ({ label: row.name, value: row.address }));

        dispatch({ type: "SET_WALLETS", payload: options })


        return () => {
            dispatch({ type: "SET_INITIAL_STATE", payload: initialState })
        }
    }, [showTransferModal])


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
                                    <div className='options'>
                                        <p onClick={() => dispatch({ type: "SET_TYPE", payload: "fixed" })} className={`${data.type === "fixed" && "active"}`}>Fixed</p>
                                        <p onClick={() => dispatch({ type: "SET_TYPE", payload: "custom" })} className={`${data.type === "custom" && "active"}`}>Custom</p>
                                    </div>

                                    <div className='inputs'>

                                        {
                                            data.type === "fixed" ?
                                                <>
                                                    <p>Wallets</p>
                                                    <MultiSelect options={data.wallets} hasSelectAll={true} className="multi-select" value={selectedWallets} onChange={setSelectedWallets} />

                                                    <NumberInput value={data.value}>
                                                        <NumberInputField placeholder="Value (ETH)" onChange={e => dispatch({ type: "SET_VALUE", payload: e.target.value })} />
                                                    </NumberInput>


                                                    <div className='total'>
                                                        <HStack>
                                                            <p>Total:</p>
                                                            <p>{selectedWallets.length * data.value} ETH</p>
                                                        </HStack>
                                                    </div>
                                                </>
                                                :
                                                data.type === "custom" ?

                                                    <>
                                                        <HStack>
                                                            <Select>
                                                                {
                                                                    data?.wallets?.map(row => (
                                                                        <option value={row.value}>{row.label}</option>
                                                                    ))
                                                                }
                                                            </Select>

                                                            <NumberInput value={data.value}>
                                                                <NumberInputField placeholder="Value (ETH)" onChange={e => dispatch({ type: "SET_VALUE", payload: e.target.value })} />
                                                            </NumberInput>
                                                        </HStack>

                                                        <Button onClick={() => dispatch("SET_")}>
                                                            <i class="fa-solid fa-plus"></i>
                                                            <p>Add wallet</p>
                                                        </Button>

                                                        <HStack className='alert low-opacity little-text'>
                                                            <i class="fa-solid fa-triangle-exclamation"></i>
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
