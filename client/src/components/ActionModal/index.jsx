import {
  HStack,
  Modal,
  ModalBody,
  Button,
  ModalContent,
  ModalOverlay,
  Select,
  RadioGroup,
  Radio,
  Input,
} from "@chakra-ui/react";
import { useGetWallets } from "@Hooks";
import React, { useMemo } from "react";
// import { useEditTask } from "src/pages/bots/sniper/hooks/useEditTask";
// import { Loader } from "../Loader";
import "./style.scss";

export const ActionModal = React.memo(({ data, action, setData, type }) => {
  const wallets = useGetWallets();
  // const { restartingLoading } = useEditTask(undefined, undefined);

  const closeModal = () => {
    if (type === "confirmDeleteWallet") {
      setData({ show: false, id: null });
    } else if (type === "restartBotSnipe") {
      setData({ show: false, id: null, privateKey: null, walletAddress: null, walletType: "privatekey" });
    }
  };

  const callAction = async () => {
    if (!isValidAction) return;
    if (type === "confirmDeleteWallet") {
      action({ id: data.id });
    } else if (type === "restartBotSnipe") {
      const { privateKey } = data;
      await action(data.id, privateKey);
    }
    closeModal();
  };

  const handleSetData = (key, value) => {
    if (key === "walletAddress" && wallets?.length > 0) {
      const privateKey = wallets.find(wallet => wallet?.address === value)?.privateKey;

      setData({ ...data, [key]: value, privateKey });
    } else setData({ ...data, [key]: value });
  };

  const isValidAction = useMemo(() => {
    if (type === "confirmDeleteWallet") {
      return true;
    } else if (type === "restartBotSnipe") {
      return data.privateKey?.length === 66 || data.privateKey?.length === 64;
    }
  }, [data, type]);

  return (
    <>
      <Modal isOpen={data.show} onClose={closeModal} isCentered={true}>
        <ModalOverlay />
        <ModalContent className="action-modal-container">
          {type === "confirmDeleteWallet" && (
            <ModalBody className="modal-body">
              <h1>Are you sure you want to delete this wallet?</h1>
              <HStack className="little-text low-opacity">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p>If you haven't saved yous private key you will lose it.</p>
              </HStack>

              <HStack width={"100%"} justifyContent="space-between">
                <Button colorScheme="blue" mr={3} onClick={closeModal} width="50%">
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={callAction} width="50%">
                  Delete
                </Button>
              </HStack>
            </ModalBody>
          )}
          {type === "restartBotSnipe" && (
            <ModalBody className="modal-body">
              <h1>Choose the wallet you want to use to restart the task.</h1>

              <RadioGroup onChange={value => handleSetData("walletType", value)} defaultValue={data.walletType}>
                <HStack gap={"15px"}>
                  <Radio value="privatekey">Private key</Radio>
                  <Radio value={"wallet"}>Wallets</Radio>
                </HStack>
              </RadioGroup>

              {data.walletType === "privatekey" ? (
                <Input
                  placeholder="Private key"
                  type="password"
                  value={data.privateKey}
                  onChange={e => handleSetData("privateKey", e.target.value)}
                />
              ) : (
                <Select onChange={e => handleSetData("walletAddress", e.target.value)} value={data.walletAddress}>
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

              <HStack width={"100%"} justifyContent="space-between">
                <Button colorScheme="blue" mr={3} onClick={closeModal} width="50%">
                  Cancel
                </Button>
                <Button
                  colorScheme={`${type === "restartBotSnipe" ? "blue" : "red"}`}
                  onClick={callAction}
                  width="50%"
                  className={`action-button ${isValidAction && "active"}`}
                >
                  {type === "confirmDeleteWallet" && "Delete"}
                  {type === "restartBotSnipe" && "Restart"}
                  {/* {restartingLoading && <Loader width={"25px"} height={"25px"} />} */}
                </Button>
              </HStack>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
