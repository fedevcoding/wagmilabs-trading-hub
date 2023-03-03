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
  Radio,
  RadioGroup,
  Select,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import EthereumSearch from "src/pages/search/EthereumSearch";
import { useHandleData, useSteps } from "./hooks";

export const NewTaskModal = React.memo(({ showNewTask, toggleNewTask }) => {
  const { step, nextStep, prevStep, resetStep } = useSteps();

  const {
    collection,
    minPrice,
    maxPrice,
    walletType,
    walletAddress,
    privateKey,
    handleSetData,
    handleCollectionClick,
    resetCollection,
  } = useHandleData();

  useEffect(() => {
    if (showNewTask) {
      resetStep();
    }
  }, [showNewTask, resetStep]);

  const closeNewTask = () => {
    toggleNewTask(false);
  };

  const saveTask = () => {
    closeNewTask();
  };

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
                  <p>Collection</p>

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
                  <p>Price</p>
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
                  <p>Wallet</p>
                  <RadioGroup onChange={value => handleSetData("walletType", value)} defaultValue={walletType}>
                    <HStack gap={"15px"}>
                      <Radio value="privatekey">Private key</Radio>
                      <Radio value={"wallet"}>Wallets</Radio>
                    </HStack>
                  </RadioGroup>

                  {walletType === "privatekey" ? (
                    <Input placeholder="Private key" type="password" />
                  ) : (
                    <Select>
                      <option value="wallet">Wallet</option>
                    </Select>
                  )}
                </div>
              </div>
            </>
          ) : (
            step === 2 && (
              <>
                <p>Gas</p>
                <HStack>
                  <p>Max Fee Per Gas:</p>
                  <NumberInput>
                    <Input placeholder="Max Fee Per Gas" />
                  </NumberInput>
                </HStack>
                <HStack>
                  <p>Max Priority Fee Per Gas:</p>
                  <NumberInput>
                    <Input placeholder="Max Priority Fee Per Gas" />
                  </NumberInput>
                </HStack>

                <p>Max auto buy</p>
                <NumberInput>
                  <Input placeholder="Max auto buy" />
                </NumberInput>
              </>
            )
          )}
        </ModalBody>

        <ModalFooter>
          <HStack gap={"10px"}>
            {step === 1 ? (
              <>
                <Button onClick={closeNewTask}>Cancel</Button>
                <Button onClick={nextStep}>Next</Button>
              </>
            ) : (
              step === 2 && (
                <>
                  <Button onClick={prevStep}>Back</Button>
                  <Button onClick={saveTask}>Save</Button>
                </>
              )
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
