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

import "./style.scss";

export const TransferItemModal = React.memo(
  ({
    details: {
      token: { name },
    },
    address: fromAddress,
    isOpen,
    setIsOpen,
    id: tokenId,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [address, setAddress] = React.useState(null);
    const [isValidAddress, setIsValidAddress] = React.useState(false);

    const transferNft = () => true;

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
              <b>Insert address</b>
            </p>
            <Input
              placeholder={`e.g. 0x1ed3...`}
              onChange={e => {
                setAddress(e.target.value);
                setIsValidAddress(isValidEthAddress(e.target.value));
              }}
            />

            <p className="warning-msg">
              <i className="fa fa-warning" />
              Items sent to the wrong address cannot be recovered
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={() => {
                if (!confirmingList)
                  transferNft(fromAddress, tokenId, address, setConfirmingList);
              }}
              isDisabled={!isValidAddress}
            >
              {confirmingList ? (
                <Loader width={"20px"} height={"20px"} />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
