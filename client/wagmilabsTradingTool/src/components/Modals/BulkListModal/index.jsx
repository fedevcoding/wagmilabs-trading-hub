import React from "react";
import { Modal, ModalBody, ModalContent, ModalOverlay, Progress } from "@chakra-ui/react";

// import "./index.scss";

export const BulkListModal = React.memo(({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <div className="bulk-list-modal-container">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent className="promo-modal">
          <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
          <ModalBody className="modal-body">
            <h1 className="title">{data.type === "approve" ? "Approve" : "Sign"} transactions</h1>
          </ModalBody>
          <Progress
            value={parseInt(data.completedAmount)}
            max={parseInt(data.totalAmount)}
            colorScheme="green"
            size="sm"
            width={"80%"}
            borderRadius="12px"
          />
          <ModalBody className="modal-body">
            <h3 className="body">
              {data.completedAmount} / {data.totalAmount}
            </h3>

            <Progress value={80} />
          </ModalBody>
        </ModalContent>
      </div>
    </Modal>
  );
});
