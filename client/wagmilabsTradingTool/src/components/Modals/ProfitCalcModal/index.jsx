import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";

import "./style.scss";

export const ProfitCalcModal = React.memo(({ isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <ModalOverlay />
      <ModalContent className="profit-calc-modal">
        <ModalCloseButton />
        <ModalBody>
          <iframe src="https://profitcalc.wagmilabs.tools?modalLayout=1" title="Profit Calc" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
