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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import EthereumSearch from "src/pages/search/EthereumSearch";
import { useHandleData, useSteps } from "./hooks";
import { useGetWallets } from "@Hooks";
import { useSaveTask } from "./hooks/useSaveTask";

export const NewTaskModal = React.memo(({ showNewTask, toggleNewTask }) => {
  const { step, nextStep, prevStep, resetStep } = useSteps();
  const wallets = useGetWallets();
  const {
    collection,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    maxFeePerGas,
    maxAutoBuy,
    data,
    handleSetData,
    handleCollectionClick,
    resetCollection,
    resetData,
    isValidNextStep,
  } = useHandleData(wallets, step);

  const closeNewTask = () => {
    toggleNewTask(false);
    resetStep();
    resetData();
  };

  const { saveTask, isLoading } = useSaveTask(closeNewTask);

  // const saveTask = async () => {
  //   closeNewTask();
  // };

  return (
    <Modal isOpen={showNewTask} onClose={closeNewTask}>
      <ModalOverlay />
      <ModalContent className="new-snipe-task-modal">
        <ModalHeader>New Snipe Task {" " + step}/2</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {step === 1 ? (
            <>
              <div className="step1-container">
                <div className="option">
                  <p className="titles">Collection</p>

                  {collection.address ? (
                    <div className="collection-container">
                      <HStack>
                        <img src={collection.image} alt={collection.name} className="collection-image" />
                        <p className="collection-name">{collection.name}</p>
                      </HStack>

                      <i class="fa-solid fa-x" onClick={resetCollection}></i>
                    </div>
                  ) : (
                    <EthereumSearch inLogin={false} usage={"sniperBot"} onClick={handleCollectionClick} />
                  )}
                </div>

                <div className="option">
                  <p className="titles">Price</p>
                  <HStack>
                    <NumberInput>
                      <Input
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => handleSetData("minPrice", e.target.value)}
                      />
                    </NumberInput>
                    <p>-</p>
                    <NumberInput>
                      <Input
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => handleSetData("maxPrice", e.target.value)}
                      />
                    </NumberInput>
                  </HStack>
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
          ) : (
            step === 2 && (
              <div className="step2-container flex-col">
                {/* <HStack className="flex-col">
                  <p>Max Fee Per Gas:</p>
                  <NumberInput  onChange={e => handleSetData("maxFeePerGas", e.target.value)}>
                    <Input placeholder="Max Fee Per Gas" />
                  </NumberInput>
                </HStack> */}
                <HStack className="flex-col">
                  <p>Max Priority Fee Per Gas:</p>
                  <NumberInput value={maxFeePerGas} onChange={value => handleSetData("maxPriorityFeePerGas", value)}>
                    <NumberInputField placeholder="Max Priority Fee Per Gas" />
                  </NumberInput>
                </HStack>

                <HStack className="flex-col">
                  <p>Max auto buy</p>
                  <NumberInput value={maxAutoBuy} onChange={value => handleSetData("maxAutoBuy", value)}>
                    <NumberInputField placeholder="Max auto buy" />
                  </NumberInput>
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
            ) : (
              step === 2 && (
                <>
                  <Button onClick={prevStep}>Back</Button>
                  <Button
                    onClick={() => isValidNextStep && saveTask(data)}
                    className={`${!isValidNextStep && "not-active"}`}
                  >
                    Save
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
