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
  Switch,
} from "@chakra-ui/react";
import { useListNft } from "@Hooks";
import { Loader, OrderInfo, Select } from "@Components";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.scss";

export const ListItemModal = React.memo(
  ({
    id,
    isOpen,
    address,
    currency,
    setIsOpen,
    lastListing,
    details: {
      token: { name },
    },
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [ethAmountPrice, setEthAmountPrice] = React.useState(null);
    const marketplaces = getMarketplaces();
    const [date, setDate] = React.useState(null);
    const [marketplace, setMarketplace] = React.useState(marketplaces[0]);
    const [royaltiesPerc, setRoyaltiesPerc] = React.useState(0.5);
    const [autoRoyalties, setAutoRoyalties] = React.useState(true);

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
            {(lastListing && (
              <div className="last-listing-info">
                <h2>Last listing info</h2>
                <OrderInfo order={lastListing} />
                <hr />
              </div>
            )) ||
              ""}
            <p className="label">
              <b>{lastListing ? "Set new price" : "Set price"}</b>
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
            {(marketplace.value === "opensea" && (
              <div>
                <br />
                <div className="space-between">
                  <p className="label">
                    <b>Auto royalties</b>
                  </p>
                  <Switch
                    isChecked={autoRoyalties}
                    colorScheme="gray"
                    onChange={e => setAutoRoyalties(e.target.checked)}
                  />
                </div>
                {(!autoRoyalties && (
                  <>
                    <br />
                    <p className="label">
                      <b>Creator royalties percentage</b>
                    </p>
                    <NumberInput max={100} min={0.5} step={0.01} value={royaltiesPerc}>
                      <NumberInputField placeholder={`Value...`} onChange={e => setRoyaltiesPerc(e.target.value)} />
                    </NumberInput>
                  </>
                )) ||
                  ""}
              </div>
            )) ||
              ""}
            <br />
            <p className="label">
              <b>Set expiration date</b>
            </p>
            <ReactDatePicker
              minDate={new Date().getTime()}
              onChange={v => setDate(v)}
              selected={date}
              isClearable={true}
              placeholderText="Select event date"
              className="date-picker"
              showTimeSelect
              dateFormat="Pp"
              preventOpenOnFocus
              showMonthYearDropdown={false}
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
                    marketplace.value,
                    autoRoyalties ? null : royaltiesPerc
                  );
              }}
            >
              {confirmingList ? <Loader width={"20px"} height={"20px"} /> : "Confirm"}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
