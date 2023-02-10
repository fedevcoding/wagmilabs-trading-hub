import React from "react";
import { getDays } from "./functions";
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
import { Select } from "../../../utility-components";
import { useListNft } from "../../../../custom-hooks";
import Loader from "../../../utility-components/Loaders/Loader";

export const ListItemModal = React.memo(
  ({
    details: {
      token: { name },
    },
    isOpen,
    setIsOpen,
    address,
    id,
  }) => {
    const [confirmingList, setConfirmingList] = React.useState(false);
    const [ethAmountPrice, setEthAmountPrice] = React.useState(null);
    const listDays = getDays();
    const [days, setDays] = React.useState(listDays[0]);

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
        <ModalContent>
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
                placeholder="Insert ETH amount"
                onChange={e => setEthAmountPrice(e.target.value)}
              />
            </NumberInput>
            <br />
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
              className="btn-list"
              mr={3}
              onClick={() => {
                if (!confirmingList) listNft(setConfirmingList, days.value);
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
