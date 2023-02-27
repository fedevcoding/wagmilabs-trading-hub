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
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { Select } from "@Components";

import "./style.scss";
import { getCurrencies, getTaxedTypes } from "./functions";

export const TaxSettingsModal = React.memo(
  ({ isOpen, setIsOpen, ...settings }) => {
    const toast = useToast();
    const { taxedOn, currency, taxPerc, setTaxedOn, setCurrency, setTaxPerc } =
      settings;

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="tax-settings-modal">
          <ModalHeader>Tax Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="space-between">
              <span>Taxed on</span>
              <Select
                id="set-taxed-on"
                onChange={v => setTaxedOn(v)}
                label="Set taxed on"
                value={taxedOn}
                options={getTaxedTypes()}
              />
            </div>
            <div className="space-between input">
              <span>Tax %</span>
              <div className="tax-perc">
                <NumberInput max={100} min={0} step={0.01} value={taxPerc}>
                  <NumberInputField
                    placeholder={`Value...`}
                    onChange={e => setTaxPerc(e.target.value)}
                  />
                </NumberInput>
                <span>%</span>
              </div>
            </div>
            <div className="space-between input">
              <span>Currency</span>
              <Select
                id="set-currency"
                onChange={v => setCurrency(v)}
                label="Set currency"
                value={currency}
                options={getCurrencies()}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={async () => {
                if (!taxPerc) {
                  toast({
                    title: "Error",
                    description: "Please, insert tax percentage!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  setIsOpen(false);
                }
              }}
            >
              Confirm
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
