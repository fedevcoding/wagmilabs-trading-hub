import React from "react";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@chakra-ui/react";
import EthereumSearch from "src/pages/search/EthereumSearch";
import { useHandleData, useSteps } from "./hooks";
import { useGetWallets } from "@Hooks";
import { useEditTask } from "../../../hooks/useEditTask";
import { Loader } from "@Components";
import { placeholderImage } from "src/assets";

export const NewTaskModal = React.memo(({ showNewTask, toggleNewTaskModal, toggleSnipe }) => {
  const { step, nextStep, prevStep, resetStep } = useSteps();
  const wallets = useGetWallets();
  const {
    collectionAddress,
    collectionImage,
    collectionName,
    walletType,
    walletAddress,
    privateKey,
    maxPriorityFeePerGas,
    maxFeePerGas,
    maxAutoBuy,
    data,
    maxFeePerGasType,
    handleSetData,
    handleCollectionClick,
    resetCollection,
    resetData,
    isValidNextStep,
  } = useHandleData(wallets, step);

  const closeNewTask = () => {
    toggleNewTaskModal(false);
    resetStep();
    resetData();
  };

  const { saveTask, addLoading } = useEditTask(closeNewTask, toggleSnipe);

  return (
    <Modal isOpen={showNewTask} onClose={closeNewTask}>
      <ModalOverlay />
      <ModalContent className="new-snipe-task-modal">
        <ModalHeader>New Mint Task {" " + step}/3</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {step === 1 ? (
            <>
              <div className="step1-container">
                <div className="option">
                  <p className="titles">Collection</p>

                  {collectionAddress ? (
                    <div className="collection-container">
                      <HStack>
                        <img
                          src={collectionImage || placeholderImage}
                          alt={collectionName}
                          className="collection-image"
                        />
                        <p className="collection-name">{collectionName}</p>
                      </HStack>

                      <i class="fa-solid fa-x" onClick={resetCollection}></i>
                    </div>
                  ) : (
                    <EthereumSearch inLogin={false} usage={"sniperBot"} onClick={handleCollectionClick} />
                  )}
                </div>

                <div className="option">
                  <p className="titles">Wallet</p>
                  <RadioGroup onChange={value => handleSetData("walletType", value)} defaultValue={walletType}>
                    <HStack gap={"15px"}>
                      <Radio value="privatekey">Private key</Radio>
                      <Radio value={"wallet"}>Wallets</Radio>
                    </HStack>
                  </RadioGroup>

                  {walletType === "privatekey" ? (
                    <Input
                      placeholder="Private key"
                      type="password"
                      value={privateKey}
                      onChange={e => handleSetData("privateKey", e.target.value)}
                    />
                  ) : (
                    <Select onChange={e => handleSetData("walletAddress", e.target.value)} value={walletAddress}>
                      <option value={undefined} style={{ display: "none" }}>
                        Select wallet
                      </option>
                      {wallets?.map(row => (
                        <option value={row.address} key={crypto.randomUUID()}>
                          {row.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              </div>
            </>
          ) : step === 2 ? (
            <div className="step2-container flex-col">Function:</div>
          ) : (
            step === 3 && (
              <div className="step2-container flex-col">
                <HStack className="flex-col">
                  <p>Max Fee Per Gas:</p>
                  <HStack width={"50%"}>
                    <Select onChange={e => handleSetData("maxFeePerGasType", e.target.value)} className="chakra-select">
                      <option value="auto">Auto</option>
                      <option value="custom">Custom</option>
                    </Select>
                  </HStack>

                  {maxFeePerGasType === "custom" && (
                    <NumberInput value={maxFeePerGas} onChange={value => handleSetData("maxFeePerGas", value)}>
                      <NumberInputField placeholder="Max Fee Per Gas (gwei)" />
                    </NumberInput>
                  )}
                </HStack>

                <HStack className="flex-col">
                  <p>Max Priority Fee Per Gas:</p>
                  <NumberInput
                    value={maxPriorityFeePerGas}
                    onChange={value => handleSetData("maxPriorityFeePerGas", value)}
                  >
                    <NumberInputField placeholder="Max Priority (gwei)" />
                  </NumberInput>
                </HStack>

                <HStack className="flex-col">
                  <p>Max auto buy</p>
                  <NumberInput value={maxAutoBuy} onChange={value => handleSetData("maxAutoBuy", value)}>
                    <NumberInputField placeholder="Max auto buy" />
                  </NumberInput>
                </HStack>

                <HStack justifyContent={"center"}>
                  <p>Skip flagged tokens</p>
                  <Switch defaultChecked onChange={e => handleSetData("skipFlaggedTokens", e.target.value)} />
                </HStack>
              </div>
            )
          )}
        </ModalBody>

        <ModalFooter className="modal-footer">
          <HStack gap={"10px"}>
            {step === 1 ? (
              <>
                <Button onClick={closeNewTask}>Cancel</Button>
                <Button
                  onClick={isValidNextStep ? nextStep : undefined}
                  className={`${!isValidNextStep && "not-active"}`}
                >
                  Next
                </Button>
              </>
            ) : step === 2 ? (
              <>
                <Button onClick={prevStep}>Back</Button>
                <Button
                  onClick={() => isValidNextStep && !addLoading && saveTask(data)}
                  className={`${!isValidNextStep && "not-active"}`}
                >
                  {addLoading ? <Loader width={"25px"} height="25px" /> : <p>Save</p>}
                </Button>
              </>
            ) : (
              step === 3 && (
                <>
                  <Button onClick={prevStep}>Back</Button>
                  <Button
                    onClick={() => isValidNextStep && !addLoading && saveTask(data)}
                    className={`${!isValidNextStep && "not-active"}`}
                  >
                    {addLoading ? <Loader width={"25px"} height="25px" /> : <p>Save</p>}
                  </Button>
                </>
              )
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
