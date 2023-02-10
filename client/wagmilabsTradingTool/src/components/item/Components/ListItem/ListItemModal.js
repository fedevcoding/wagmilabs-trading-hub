import React from "react";
import { listItem } from "./functions";
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

export const ListItemModal = React.memo(
  ({
    details: {
      token: { name },
    },
    isOpen,
    setIsOpen,
  }) => {
    const [ethAmountPrice, setEthAmountPrice] = React.useState(null);

    console.log(name);

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Sell item <b>{name}</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Modal body content...</ModalBody>
          <ModalFooter>
            <Button
              variantColor="black"
              className="btn-list"
              mr={3}
              onClick={() => {
                setIsOpen(false);
                listItem(ethAmountPrice);
              }}
            >
              List item
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
