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
    NumberInputField,
    useToast
} from '@chakra-ui/react'
import { useWeb3Utils } from '@Hooks';
import { Loader } from '@Components';
import { wait } from '@Utils';

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

    const toast = useToast()

    const { getAddressAndBalance, generateWallets } = useWeb3Utils()

    const [data, dispatch] = React.useReducer(reducer, initialState)

    const [loading, setLoading] = React.useState(false)



    useEffect(() => {
        dispatch({ type: "SET_INITIAL_STATE", payload: initialState })

        return () => {
            dispatch({ type: "SET_INITIAL_STATE", payload: initialState })
        }
    }, [showAddModal])


    const createWallet = async () => {

        try {
            if (!hasAddConditions || loading) return

            const { type, name, amount, privateKey } = data

            setLoading(true)
            let code;

            const date = new Date().toISOString().slice(0, 10)

            if (type === "generate") {

                await wait(100)

                const wallets = await generateWallets(amount, name, date)

                for (let i = 0; i < wallets.length; i++) {
                    const wallet = wallets[i]
                    code = toggleWallet(wallet, true)
                }

            }
            else if (type === "use") {

                const id = crypto.randomUUID()

                const { address, balance } = await getAddressAndBalance(privateKey)

                const wallet = { type, name, privateKey, address, balance, id, date }

                code = toggleWallet(wallet, true)
            }

            if (code === 1) {
                toast({
                    title: "Wallet(s) added.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            }
            else if (code === 0) {
                toast({
                    title: "Wallet already exists.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                })
            }
            else if (code === 2) {
                toast({
                    title: "Name already exists.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
            else if (code === 4) {
                toast({
                    title: "Max wallets reached (50).",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }

            toggleModal("add", false)
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoading(false)
        }

    }


    const hasAddConditions = useMemo(() => data.type === "use" ? data.name.length > 0 && data.privateKey.length === 64 ? true : false : data.name.length > 0 && data.amount > 0 ? true : false, [data])

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
                                        <p onClick={() => dispatch({ type: "SET_TYPE", payload: "use" })} className={`${data.type === "use" && "active"}`}>Use</p>
                                        <p onClick={() => dispatch({ type: "SET_TYPE", payload: "generate" })} className={`${data.type === "generate" && "active"}`}>Generate</p>
                                    </div>

                                    <div className='inputs'>

                                        {
                                            data.type === "use" ?
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
                                                data.type === "generate" ?

                                                    <>

                                                        <div>
                                                            <p>Wallet name</p>
                                                            <Input value={data.name} placeholder={"Name"} onChange={e => dispatch({ type: "SET_NAME", payload: e.target.value })} />
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
                                    {
                                        loading ?
                                            <Loader width={"20px"} height={"20px"} />
                                            :
                                            <p>Add!</p>
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
