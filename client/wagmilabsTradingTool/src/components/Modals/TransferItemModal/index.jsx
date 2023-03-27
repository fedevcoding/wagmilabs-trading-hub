import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";
import { Loader } from "@Components";
import { isValidEthAddress } from "@Utils";
import { useTransferItem } from "@Hooks";
import { fetchEnsAddress } from "@wagmi/core";

import "./style.scss";

export const TransferItemModal = React.memo(
  ({
    details: {
      token: { name },
    },
    address: contractAddress,
    isOpen,
    setIsOpen,
    id: tokenId,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [address, setAddress] = React.useState(null);
    const [isValidAddress, setIsValidAddress] = React.useState(false);
    const [sendEns, setSendEns] = React.useState(false);

    const { transferNft } = useTransferItem();

    const transfer = async (contractAddress, tokenId, toAddress, setConfirmingList) => {
      setConfirmingList(true);
      await transferNft(contractAddress, tokenId, toAddress);
      setConfirmingList(false);
    };

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="transfer-item-modal">
          <ModalHeader>
            Transfer item <b>{name}</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="label">
              <b>Insert address or ENS (ethereum name service)</b>
            </p>
            <Input
              placeholder={`e.g. 0x1ed3...`}
              onChange={e => {
                const value = e.target.value;
                const isEns = value.endsWith(".eth");

                if (isEns) {
                  fetchEnsAddress({
                    name: value,
                    chainId: 1,
                  }).then(addr => {
                    if (addr) {
                      setIsValidAddress(true);
                      setAddress(addr);
                      setSendEns(true);
                    } else {
                      setIsValidAddress(false);
                      setSendEns(false);
                    }
                  });
                } else {
                  setAddress(value);
                  setIsValidAddress(isValidEthAddress(value));
                  setSendEns(false);
                }
              }}
            />

            <p className="warning-msg">
              <i className="fa fa-warning" />
              Items sent to the wrong address cannot be recovered
            </p>

            {(sendEns && <p className="addr-ens">{`The nft will be sent to ${address}`}</p>) || ""}
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={() => {
                if (!confirmingList) transfer(contractAddress, tokenId, address, setConfirmingList);
              }}
              isDisabled={!isValidAddress}
            >
              {confirmingList ? <Loader width={"20px"} height={"20px"} /> : "Confirm"}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
