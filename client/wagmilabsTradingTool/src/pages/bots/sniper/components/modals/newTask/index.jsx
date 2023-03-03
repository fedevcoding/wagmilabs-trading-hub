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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import EthereumSearch from "src/pages/search/EthereumSearch";
import { useHandleData, useSteps } from "./hooks";

export const NewTaskModal = React.memo(({ showNewTask, toggleNewTask }) => {
  const { step, nextStep, prevStep, resetStep } = useSteps();

  const { collection, minPrice, maxPrice, walletType, walletAddress, privateKey, handleSetData } = useHandleData();

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
      <ModalContent>
        <ModalCloseButton />

        <ModalBody>
          {step === 1 ? (
            <>
              <p>Collection</p>
              <EthereumSearch inLogin={false} usage={"sniperBot"} onClick={data => console.log(data)} />
              <p>Price</p>
              <HStack>
                <NumberInput>
                  <Input placeholder="Min" />
                </NumberInput>
                <p>-</p>
                <NumberInput>
                  <Input placeholder="Max" />
                </NumberInput>
              </HStack>

              <p>Wallet</p>
              <RadioGroup>
                <Radio>Private key</Radio>
                <Radio>Wallets</Radio>
              </RadioGroup>

              <Input placeholder="Private key" />
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
