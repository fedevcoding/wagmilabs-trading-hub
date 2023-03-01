import { HStack, Modal, ModalBody, Button, ModalContent, ModalOverlay } from "@chakra-ui/react";
import React from "react";

export const ConfirmDeleteModal = React.memo(({ confirmDelete, toggleWallet, setConfirmDelete }) => {
  const closeModal = () => {
    setConfirmDelete({ show: false, id: null });
  };

  const deleteWallet = () => {
    toggleWallet({ id: confirmDelete.id });
    closeModal();
  };
  return (
    <>
      <Modal isOpen={confirmDelete.show} onClose={closeModal} isCentered={true}>
        <ModalOverlay />
        <ModalContent className="confirm-delete-wallet-modal">
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
              <Button colorScheme="red" onClick={deleteWallet} width="50%">
                Delete
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
