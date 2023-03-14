import React, { useEffect, useMemo } from "react";
import { useWeb3Utils } from "@Hooks";
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
  useToast,
} from "@chakra-ui/react";
import { MultiSelect } from "react-multi-select-component";
import { BigNumber } from "ethers";
import { checkErrors, roundPrice } from "@Utils";
import { Loader } from "@Components";

const nullAddress = "0x0000000000000000000000000000000000000000";

const fixedInitialState = {
  value: 0,
  loading: false,
  selectOptions: [],
};
const customInitialState = {
  transfers: [
    {
      id: crypto.randomUUID(),
      address: undefined,
      value: undefined,
    },
  ],
};

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
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

function customReducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSFER":
      return { ...state, transfers: [...state.transfers, action.payload] };
    case "REMOVE_TRANSFER":
      return { ...state, transfers: state.transfers.filter(transfer => transfer.id !== action.payload) };
    case "CHANGE_TRANSFER_ADDRESS": {
      const { id, newAddress } = action.payload;
      const transfers = state.transfers.map(transfer => {
        if (transfer.id === id) {
          return { ...transfer, address: newAddress };
        }
        return transfer;
      });
      return { ...state, transfers };
    }
    case "CHANGE_TRANSFER_VALUE": {
      const { id, newValue } = action.payload;
      const transfers = state.transfers.map(transfer => {
        if (transfer.id === id) {
          return { ...transfer, value: newValue };
        }
        return transfer;
      });
      return { ...state, transfers };
    }
    case "SET_INITIAL_STATE":
      return action.payload;
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export const TransferModal = React.memo(({ showTransferModal, toggleModal }) => {
  const { batchTransferEth } = useWeb3Utils();

  const [type, setType] = React.useState("fixed");
  const [wallets, setWallets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // fixed type states
  const [fixedData, dispatchFixed] = React.useReducer(fixedReducer, fixedInitialState);
  const [selectedWallets, setSelectedWallets] = React.useState([]);

  // custom type states
  const [customData, dispatchCustom] = React.useReducer(customReducer, customInitialState);

  const toast = useToast();

  useEffect(() => {
    const wallets = JSON.parse(localStorage.getItem("wallets")) || [];
    const options = wallets.map(row => ({ label: row.name, value: row.address }));

    dispatchFixed({ type: "SET_SELECT_OPTIONS", payload: options });
    setWallets(wallets);

    return () => {
      setType("fixed");
      dispatchFixed({ type: "SET_INITIAL_STATE", payload: fixedInitialState });
      dispatchCustom({ type: "SET_INITIAL_STATE", payload: customInitialState });
    };
  }, [showTransferModal]);

  const transferAllowed = useMemo(
    () =>
      type === "fixed"
        ? selectedWallets.length > 0 && fixedData.value > 0
        : customData.transfers.length > 0 &&
          !customData.transfers.find(transfer => transfer.address === undefined || transfer.value === undefined),
    [fixedData, selectedWallets, type, customData]
  );

  async function transferEth() {
    if (!transferAllowed) return;

    setLoading(true);
    try {
      const total = 100;

      const toBigNumber = number => BigNumber.from((parseFloat(number) * 1000000000000000000).toString());

      if (type === "fixed") {
        const addresses = selectedWallets.map(wallet => wallet.value);
        const remainingWallets = total - addresses.length;

        const addressesToTransfer = [...addresses, ...Array(remainingWallets).fill(nullAddress)];
        const { value } = fixedData;

        const totalValue = (value * addresses.length).toFixed(10);

        const parsedValue = toBigNumber(value);

        const valuesToTransfer = [
          ...Array(addresses.length).fill(parsedValue),
          ...Array(remainingWallets).fill(toBigNumber("0")),
        ];

        await batchTransferEth(totalValue, addressesToTransfer, valuesToTransfer);

        toast({
          title: "Success",
          description: "Eth transferred successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else if (type === "custom") {
        const addresses = customData.transfers.map(wallet => wallet.address);
        const values = customData.transfers.map(wallet => toBigNumber(wallet.value));

        const totalValue = customData.transfers
          .reduce((prevVal, currentVal) => +prevVal + (+currentVal.value || 0), 0)
          .toFixed(10);

        const remainingWallets = total - addresses.length;

        const addressesToTransfer = [...addresses, ...Array(remainingWallets).fill(nullAddress)];
        const valuesToTransfer = [...values, ...Array(remainingWallets).fill(toBigNumber("0"))];

        await batchTransferEth(totalValue, addressesToTransfer, valuesToTransfer);

        toast({
          title: "Success",
          description: "Eth transferred successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      const errorMessage = checkErrors(e);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showTransferModal && (
        <Modal isOpen={true} onClose={() => toggleModal("transfer", false)} isCentered={true}>
          <ModalOverlay />
          <ModalContent className="transfer-wallet-modal">
            <ModalHeader textAlign={"center"}>
              <p>Transfer ETH</p>
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <div className="form">
                <div className="modal-types">
                  <p onClick={() => setType("fixed")} className={`${type === "fixed" && "active"}`}>
                    Fixed
                  </p>
                  <p onClick={() => setType("custom")} className={`${type === "custom" && "active"}`}>
                    Custom
                  </p>
                </div>

                <div className="inputs">
                  {type === "fixed" ? (
                    <div className="fixed">
                      <div className="wallets">
                        <p>Select wallets</p>
                        <MultiSelect
                          options={fixedData.selectOptions}
                          hasSelectAll={true}
                          className="multi-select"
                          value={selectedWallets}
                          onChange={setSelectedWallets}
                        />
                      </div>

                      <NumberInput value={fixedData.value}>
                        <NumberInputField
                          placeholder="Value (ETH)"
                          onChange={e => dispatchFixed({ type: "SET_VALUE", payload: e.target.value })}
                        />
                      </NumberInput>

                      <div className="total">
                        <HStack>
                          <p>Total wallets:</p>
                          <p>{selectedWallets.length}</p>
                        </HStack>

                        <HStack>
                          <p>Total:</p>
                          <p>{roundPrice((selectedWallets.length * fixedData.value).toFixed(10))} ETH</p>
                        </HStack>
                      </div>
                    </div>
                  ) : type === "custom" ? (
                    <div className="custom">
                      <div className="wallets">
                        {customData.transfers.map((transfer, index) => {
                          const { id, address } = transfer;

                          return (
                            <HStack key={index}>
                              <Select
                                onChange={e =>
                                  dispatchCustom({
                                    type: "CHANGE_TRANSFER_ADDRESS",
                                    payload: { newAddress: e.target.value, id },
                                  })
                                }
                                value={address}
                              >
                                <option value={undefined} style={{ display: "none" }}>
                                  Select wallet
                                </option>
                                {wallets?.map(row => (
                                  <option value={row.address} key={crypto.randomUUID()}>
                                    {row.name}
                                  </option>
                                ))}
                              </Select>

                              <NumberInput value={transfer.value}>
                                <NumberInputField
                                  placeholder="Value (ETH)"
                                  onChange={e =>
                                    dispatchCustom({
                                      type: "CHANGE_TRANSFER_VALUE",
                                      payload: { newValue: e.target.value, id },
                                    })
                                  }
                                />
                              </NumberInput>

                              <div
                                className={`remove ${customData.transfers.length > 1 && "active"}`}
                                onClick={() =>
                                  customData.transfers.length > 1 &&
                                  dispatchCustom({ type: "REMOVE_TRANSFER", payload: id })
                                }
                              >
                                <i className="fa-sharp fa-solid fa-trash-can"></i>
                              </div>
                            </HStack>
                          );
                        })}
                      </div>

                      <Button
                        onClick={() =>
                          dispatchCustom({
                            type: "ADD_TRANSFER",
                            payload: { value: undefined, address: undefined, id: crypto.randomUUID() },
                          })
                        }
                        className="add-wallet-btn"
                      >
                        <i className="fa-solid fa-plus"></i>
                        <p>Add wallet</p>
                      </Button>

                      <div className="total">
                        <HStack>
                          <p>Total wallets:</p>
                          <p>{customData.transfers.length}</p>
                        </HStack>

                        <HStack>
                          <p>Total:</p>
                          <p>
                            {roundPrice(
                              customData.transfers
                                .reduce((prevVal, currentVal) => +prevVal + (+currentVal.value || 0), 0)
                                .toFixed(10)
                            )}{" "}
                            ETH
                          </p>
                        </HStack>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </ModalBody>

            <ModalFooter justifyContent={"center"}>
              <Button
                colorScheme="blue"
                width={"100%"}
                className={`add-button ${transferAllowed && "active"}`}
                onClick={transferEth}
              >
                {loading ? <Loader width={"20px"} height={"20px"} /> : <p>Transfer</p>}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
});
