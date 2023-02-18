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
import { Loader } from "@Components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.scss";
import { UserDataContext } from "@Context";

export const MakeOfferModal = React.memo(
  ({
    isOpen,
    address,
    tokenId,
    currency,
    setIsOpen,
    marketplace,
    details: {
      token: { name },
      market: { topBid },
    },
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [price, setPrice] = React.useState(null);
    const { placeBid } = usePlaceBid(marketplace);
    const { userBalances } = useContext(UserDataContext);
    const [date, setDate] = React.useState(null);

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
              Balance: {parseFloat(userBalances[currency] || 0)} {currency}
            </p>
            <br />
            {topBid?.id && (
              <>
                <p>
                  Best offer: {topBid.price.amount.native}{" "}
                  {topBid.price.currency.symbol}
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
                placeholder={`Insert ${currency} amount`}
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
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={async () => {
                setConfirmingList(true);
                await placeBid(`${address}:${tokenId}`, price, date);
                setConfirmingList(false);
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
