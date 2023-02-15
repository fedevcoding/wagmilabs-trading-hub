import React from "react";
import { getDays, getMarketplaces } from "./functions";
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
    const listDays = getDays();
    const marketplaces = getMarketplaces();
    const [days, setDays] = React.useState(listDays[0]);
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
              <b>Set days</b>
            </p>
            <Select
              id="set-day"
              onChange={r => setDays(r)}
              label="Set days"
              value={days}
              options={listDays}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={() => {
                if (!confirmingList)
                  listNft(setConfirmingList, days.value, marketplace.value);
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
