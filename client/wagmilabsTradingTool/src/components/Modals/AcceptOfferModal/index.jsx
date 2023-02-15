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
import { useAcceptOffer } from "@Hooks";
import { Loader } from "@Components";
import moment from "moment";

import "./style.scss";

export const AcceptOfferModal = React.memo(
  ({
    details: {
      token: { name },
    },
    isOpen,
    setIsOpen,
    address,
    tokenId,
    bid,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const { acceptOffer } = useAcceptOffer();

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent className="list-item-modal">
          <ModalHeader>
            Accept offer for item <b>{name || `#${tokenId}`}</b>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="label">
              <b>Market:</b> {bid.source.name}
            </p>
            <p className="label">
              <b>Maker:</b> <small>{bid.maker}</small>
            </p>
            <p className="label">
              <b>Valid until:</b>{" "}
              {`${moment(bid.validUntil * 1000)
                .utc()
                .format("MMM DD, YYYY HH:mm")} GMT`}
            </p>
            <p className="label">
              <b>Price:</b>
              {" " + bid.price.amount.native + " " + bid.price.currency.symbol}
              {` (${bid.price.amount.usd.toLocaleString("EN-us", {
                maximumFractionDigits: 2,
              })}$)`}
            </p>
            <p className="label">
              <b>Net price:</b>
              {" " +
                bid.price.netAmount.native +
                " " +
                bid.price.currency.symbol}
              {` (${bid.price.netAmount.usd.toLocaleString("EN-us", {
                maximumFractionDigits: 2,
              })}$)`}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-confirm"
              mr={3}
              onClick={async () => {
                if (!confirmingList) {
                  setConfirmingList(true);
                  await acceptOffer(address, tokenId);
                  setConfirmingList(false);
                }
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
