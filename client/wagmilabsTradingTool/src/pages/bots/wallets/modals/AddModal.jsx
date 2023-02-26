import React, { useEffect, useMemo } from 'react'
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
    Input,
    NumberInput,
    NumberInputField
} from '@chakra-ui/react'
import { useWeb3Utils } from '@Hooks';

const initialState = {
    type: "use",
    name: "",
    amount: "",
    privateKey: ""
}

function reducer(state, action) {
    switch (action.type) {
        case "SET_TYPE":
            return { ...state, type: action.payload };
        case "SET_NAME":
            return { ...state, name: action.payload };
        case "SET_AMOUNT":
            return { ...state, amount: action.payload };
        case "SET_PRIVATE_KEY":
            return { ...state, privateKey: action.payload };
        case "SET_INITIAL_STATE":
            return action.payload;
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
}

export const AddModal = ({ showAddModal, toggleModal, toggleWallet }) => {

    const { getAddressAndBalance, generateWallets } = useWeb3Utils()

    const [type, setType] = React.useState("generate")
    const [data, dispatch] = React.useReducer(reducer, initialState)


    useEffect(() => {
        dispatch({ type: "SET_INITIAL_STATE", payload: initialState })
    }, [showAddModal])


    useEffect(() => {
        dispatch({ type: "SET_TYPE", payload: type })
    }, [type])

    const createWallet = async () => {

        const { type, name, amount, privateKey } = data

        if (type === "generate") {
            const wallets = await generateWallets(amount, name)

            for (let i = 0; i < wallets.length; i++) {
                const wallet = wallets[i]
                toggleWallet(wallet, true)
            }

            console.log(wallets)
        }
        else if (type === "use") {

            // const testWalletPrivateKey = "c2def227bb82d299425c65c261f1b0926f76ae0aa310e082d834561bdd8a5216"

            const id = crypto.randomUUID()

            const { address, balance } = await getAddressAndBalance(privateKey)

            const wallet = { type, name, privateKey, count: 1, address, balance, id }

            toggleWallet(wallet, true)
        }

        // set data as initial state
        dispatch({ type: "SET_INITIAL_STATE", payload: initialState })

        toggleModal("add", false)
    }


    const hasAddConditions = useMemo(() => data.name.length > 0 && data.privateKey.length === 64 ? true : false, [data])

    return (
        <>
            {
                showAddModal && (
                    <Modal isOpen={true} onClose={() => toggleModal("add", false)} isCentered={true}>
                        <ModalOverlay />
                        <ModalContent className='add-wallet-modal'>
                            <ModalHeader textAlign={"center"}>
                                <p>Add wallet</p>
                            </ModalHeader>

                            <ModalCloseButton />

                            <ModalBody>
                                <div className='form'>
                                    <div className='options'>
                                        <p onClick={() => setType("use")} className={`${type === "use" && "active"}`}>Use</p>
                                        <p onClick={() => setType("generate")} className={`${type === "generate" && "active"}`}>Generate</p>
                                    </div>

                                    <div className='inputs'>

                                        {
                                            type === "use" ?
                                                <>
                                                    <div>
                                                        <p>Wallet name</p>
                                                        <Input value={data.name} placeholder={"Name"} onChange={e => dispatch({ type: "SET_NAME", payload: e.target.value })} />
                                                    </div>

                                                    <div>
                                                        <p>Private key</p>
                                                        <Input value={data.privateKey} type="password" placeholder="Private key" onChange={e => dispatch({ type: "SET_PRIVATE_KEY", payload: e.target.value })} />
                                                    </div>

                                                    <HStack className='alert low-opacity little-text'>
                                                        <i class="fa-solid fa-triangle-exclamation"></i>
                                                        <p>Your private key not be stored on our database.</p>
                                                    </HStack>
                                                </>
                                                :
                                                type === "generate" ?

                                                    <>

                                                        <div>
                                                            <p>Group name</p>
                                                            <Input value={data.name} placeholder={"Group name"} onChange={e => dispatch({ type: "SET_NAME", payload: e.target.value })} />
                                                        </div>

                                                        <div>
                                                            <p>Amount</p>
                                                            <NumberInput min={1} max={50} value={data.amount}>
                                                                <NumberInputField placeholder="Amount" onChange={e => dispatch({ type: "SET_AMOUNT", payload: e.target.value })} />
                                                            </NumberInput>
                                                        </div>

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
                                <Button colorScheme='blue' width={"100%"} onClick={createWallet} className={`add-button ${hasAddConditions && "active"}`}>
                                    Add!
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </>
    )
}
