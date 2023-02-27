import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

import "./index.scss";

export const PromoModal = React.memo(({ isOpen, onClose }) => {
  function addClicked() {
    localStorage.setItem("clickedPromoTwitter", true);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent className="promo-modal">
        <i className="fa-solid fa-x close-btn" onClick={onClose}></i>
        <ModalBody className="modal-body">
          <h1 className="title">Liking the platform?</h1>
        </ModalBody>

        <ModalBody className="modal-body">
          <h3 className="body">Show us some love ❤️😊</h3>
        </ModalBody>

        <ModalBody className="modal-body">
          <a
            href="https://twitter.com/intent/tweet?text=I%E2%80%99ve%20finally%20found%20the%20All-in-one%20platform%20for%20NFT%20Traders%2C%20it%20really%20has%20everything!!%20And%20it%E2%80%99s%20open%20in%20BETA%20for%20FREE!%20Try%20it%20here%3A%20https%3A%2F%2Fapp.wagmilabs.tools%2F"
            target={"_blank"}
            rel="noreferrer"
          >
            <Button
              colorScheme={"blue"}
              className="button"
              onClick={addClicked}
            >
              Share on the bird app!
            </Button>
          </a>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
