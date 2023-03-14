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
  Switch,
} from "@chakra-ui/react";
import { Select } from "@Components";

import "./style.scss";
import { clientCache } from "@Utils";

export const TaxSettingsModal = React.memo(({ isOpen, setIsOpen, ...settings }) => {
  const toast = useToast();
  const {
    taxedOn,
    currency,
    taxPerc,
    setTaxedOn,
    setCurrency,
    setTaxPerc,
    currencies,
    taxedTypes,
    taxLossHarvesting,
    setTaxLossHarvesting,
    longTermTax,
    setLongTermTax,
  } = settings;
  const [modalTaxedOn, setModalTaxedOn] = React.useState(taxedOn);
  const [modalCurrency, setModalCurrency] = React.useState(currency);
  const [modalTaxPerc, setModalTaxPerc] = React.useState(taxPerc);
  const [modalTaxLossHarvesting, setModalTaxLossHarvesting] = React.useState(taxLossHarvesting);
  const [modalLongTermTax, setModalLongTermTax] = React.useState(longTermTax);

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
              onChange={v => setModalTaxedOn(v)}
              label="Set taxed on"
              value={modalTaxedOn}
              options={taxedTypes}
              isSearchable={false}
            />
          </div>
          <div className="space-between input">
            <span>Tax %</span>
            <div className="tax-perc">
              <NumberInput max={100} min={0} step={0.01} value={modalTaxPerc}>
                <NumberInputField placeholder={`Value...`} onChange={e => setModalTaxPerc(e.target.value)} />
              </NumberInput>
              <span>%</span>
            </div>
          </div>
          <div className="space-between input">
            <span>Apply long & short term cap gains</span>
            <Switch
              isChecked={modalLongTermTax !== undefined}
              colorScheme="gray"
              onChange={e => setModalLongTermTax(e.target.checked ? 0 : undefined)}
            />
          </div>
          {(modalLongTermTax !== undefined && (
            <div className="space-between input">
              <span>Long term tax %</span>
              <div className="tax-perc">
                <NumberInput max={100} min={0} step={0.01} value={modalLongTermTax}>
                  <NumberInputField placeholder={`Value...`} onChange={e => setModalLongTermTax(e.target.value)} />
                </NumberInput>
                <span>%</span>
              </div>
            </div>
          )) ||
            ""}
          <div className="space-between input">
            <span>Currency</span>
            <Select
              id="set-currency"
              onChange={v => setModalCurrency(v)}
              label="Set currency"
              value={modalCurrency}
              options={currencies}
              isSearchable={false}
            />
          </div>
          <div className="space-between input">
            <span>Apply tax loss harvesting</span>
            <Switch
              isChecked={modalTaxLossHarvesting}
              colorScheme="gray"
              onChange={e => setModalTaxLossHarvesting(e.target.checked)}
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
                setTaxedOn(modalTaxedOn);
                setCurrency(modalCurrency);
                setTaxPerc(modalTaxPerc);
                setTaxLossHarvesting(modalTaxLossHarvesting);
                const longTermTaxValue = modalLongTermTax === undefined ? undefined : parseFloat(modalLongTermTax);
                setLongTermTax(longTermTaxValue);
                setIsOpen(false);

                clientCache(
                  "profitandloss-settings",
                  365 * 24 * 3600,
                  {
                    taxedOn: modalTaxedOn,
                    currency: modalCurrency,
                    taxPerc: modalTaxPerc,
                    taxLossHarvesting: modalTaxLossHarvesting,
                    longTermTax: longTermTaxValue,
                  },
                  true
                );
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
});
