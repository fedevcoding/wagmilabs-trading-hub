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

import "./style.scss";

export const ProfitCalcModal = React.memo(({ isOpen, setIsOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <ModalOverlay />
      <ModalContent className="profit-calc-modal">
        <ModalHeader>Profitability calculator</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <iframe src="https://profitcalc.wagmilabs.tools?modalLayout=1" title="Profit Calc" />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
