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
} from "@chakra-ui/react";
import { useAcceptOffer } from "@Hooks";
import { Loader, OrderInfo } from "@Components";

import "./style.scss";

export const AcceptOfferModal = React.memo(
  ({
    details: {
      token: { name },
    },
    isOpen,
    setIsOpen,
    address,
    tokenId,
    bid,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const { acceptOffer } = useAcceptOffer();

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="list-item-modal">
          <ModalHeader>
            Accept offer for item <b>{name || `#${tokenId}`}</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OrderInfo order={bid} />
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={async () => {
                if (!confirmingList) {
                  setConfirmingList(true);
                  await acceptOffer(address, tokenId);
                  setConfirmingList(false);
                }
              }}
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
