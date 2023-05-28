import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { LoadingSpinner } from "@Components";

import "./style.scss";

export const ProfitCalcModal = React.memo(({ isOpen, setIsOpen }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <ModalOverlay />
      <ModalContent className="profit-calc-modal">
        <ModalCloseButton />
        <ModalBody>
          {isIframeLoading && <LoadingSpinner width="100px" height="100px" margin="5rem 0" />}
          <iframe
            src="https://profitcalc.wagmilabs.tools?modalLayout=1"
            title="Profit Calc"
            onLoad={() => {
              setIsIframeLoading(false);
            }}
            style={{ display: isIframeLoading ? "none" : "block" }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
