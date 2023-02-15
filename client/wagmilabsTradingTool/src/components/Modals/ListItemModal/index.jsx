import React from "react";
import { getMarketplaces } from "./functions";
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
} from "@chakra-ui/react";
import { useListNft } from "@Hooks";
import { Loader, Select } from "@Components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.scss";

export const ListItemModal = React.memo(
  ({
    details: {
      token: { name },
    },
    currency,
    isOpen,
    setIsOpen,
    address,
    id,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [ethAmountPrice, setEthAmountPrice] = React.useState(null);
    const marketplaces = getMarketplaces();
    const [date, setDate] = React.useState(null);
    const [marketplace, setMarketplace] = React.useState(marketplaces[0]);

    const { listNft } = useListNft(
      {
        contractAddress: address,
        tokenId: id,
        listingPrice: ethAmountPrice,
      },
      () => {
        setIsOpen(false);
      }
    );

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="list-item-modal">
          <ModalHeader>
            Sell item <b>{name}</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="label">
              <b>Set price</b>
            </p>
            <NumberInput>
              <NumberInputField
                placeholder={`Insert ${currency} amount`}
                onChange={e => setEthAmountPrice(e.target.value)}
              />
            </NumberInput>
            <br />
            <p className="label">
              <b>Marketplace</b>
            </p>
            <Select
              id="set-day"
              onChange={m => setMarketplace(m)}
              label="Set Marketplace"
              value={marketplace}
              options={marketplaces}
            />
            <br />
            <p className="label">
              <b>Set expiration date</b>
            </p>

            <DatePicker
              minDate={new Date().getTime()}
              onChange={v => {
                setDate(v);
              }}
              selected={date}
              isClearable={true}
              placeholderText="Select expiration date"
              className="date-picker"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={() => {
                if (!confirmingList)
                  listNft(
                    setConfirmingList,
                    parseInt(new Date(date).getTime() / 1000).toString(),
                    marketplace.value
                  );
              }}
            >
              {confirmingList ? (
                <Loader width={"20px"} height={"20px"} />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
