import React, { useContext } from "react";
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
import { usePlaceBid } from "@Hooks";
import { Loader, DatePicker } from "@Components";
import { UserDataContext } from "@Context";
import { roundPrice } from "@Utils";

import "./style.scss";

export const MakeOfferModal = React.memo(
  ({
    isOpen,
    address,
    tokenId,
    setIsOpen,
    marketplace,
    details: {
      token: { name },
      market: { topBid },
    },
    collectionBid = false,
    currency = "weth",
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [price, setPrice] = React.useState(null);
    const { placeBid } = usePlaceBid(marketplace);
    const { userBalances } = useContext(UserDataContext);
    const [date, setDate] = React.useState(null);
    const notEnoughBalance = price > parseFloat(userBalances[currency?.toLowerCase()] || 0);

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="make-offer-modal">
          <ModalHeader>
            Make offer for <b>"{name}"</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Balance ETH: {roundPrice(parseFloat(userBalances.eth || 0)) || 0}
              <br />
              Balance WETH: {roundPrice(parseFloat(userBalances.weth || 0)) || 0}
              <br />
            </p>
            <br />
            {topBid?.id && (
              <>
                <p>
                  Best offer: {topBid.price.amount.native} {topBid.price.currency.symbol}
                  {` (${topBid.price.amount.usd.toLocaleString("EN-us", {
                    maximumFractionDigits: 2,
                  })}$)`}
                </p>
                <br />
              </>
            )}
            <p className="label">
              <b>Set offer price</b>
            </p>
            <NumberInput>
              <NumberInputField
                placeholder={`Insert ${currency.toUpperCase()} amount`}
                onChange={e => setPrice(e.target.value)}
              />
            </NumberInput>
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
              showTimeSelect
              dateFormat="Pp"
              preventOpenOnFocus
              showMonthYearDropdown={false}
            />
            {price && notEnoughBalance && (
              <p className="balance-now-enough">{currency.toUpperCase()} balance is not enough</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={async () => {
                setConfirmingList(true);
                await placeBid(collectionBid ? address : `${address}:${tokenId}`, price, date, collectionBid);
                setConfirmingList(false);
              }}
              isDisabled={!price || parseFloat(price) <= 0 || !date || notEnoughBalance}
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
