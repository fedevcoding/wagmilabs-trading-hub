import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React from "react";

export const RenameModal = ({ showRenameModal, setShowRenameModal, renameWallet }) => {
  const toast = useToast();

  const closeModal = () => {
    setShowRenameModal(false);
  };

  const rename = () => {
    renameWallet(showRenameModal.id, showRenameModal.newName);
    toast({
      title: "Wallet renamed",
      description: "Wallet renamed successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    closeModal();
  };

  return (
    <>
      <Modal isOpen={showRenameModal.show} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename wallet</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>New name</FormLabel>
              <Input
                type="text"
                value={showRenameModal?.newName}
                onChange={e => setShowRenameModal(prev => ({ ...prev, newName: e.target.value }))}
                placeholder="New name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={rename}>
              Rename
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
