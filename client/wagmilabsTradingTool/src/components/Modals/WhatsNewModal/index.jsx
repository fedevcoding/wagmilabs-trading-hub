import React from "react";
import { Button, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { whatsnew } from "@Assets";

import "./index.scss";

export const WhatsNewModal = React.memo(({ isOpen, onClose, type }) => {
  function close() {
    let key = type;
    localStorage.setItem(key, true);

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={close} isCentered>
      <div className="promo-modal-container">
        <ModalOverlay backdropFilter="blur(5px)" />

        <ModalContent className="whatsnew-modal">
          <i className="fa-solid fa-x close-btn" onClick={close}></i>
          <ModalBody className="modal-body">
            <h1 className="title">What's new?</h1>
          </ModalBody>

          <ModalBody className="modal-body">
            <div>
              <p>-Added tradingview floor price chart! 👑</p>
              <img src={whatsnew} className="whatsnew-img" alt="tradingview"></img>
            </div>
          </ModalBody>

          <ModalBody className="modal-body">
            <Button colorScheme={"blue"} className="button" onClick={close}>
              LFG!
            </Button>
          </ModalBody>
        </ModalContent>
      </div>
    </Modal>
  );
});
