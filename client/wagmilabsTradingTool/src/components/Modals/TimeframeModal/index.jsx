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
import { DatePicker } from "@Components";

import "./style.scss";

export const TimeframeModal = React.memo(({ isOpen, setIsOpen, startDate, endDate, setStartDate, setEndDate }) => {
  const today = new Date();
  const aYearAgo = new Date().setFullYear(today.getFullYear() - 1);

  const [startDateModal, setStartDateModal] = React.useState(startDate);
  const [endDateModal, setEndDateModal] = React.useState(endDate);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent className="timeframe-modal">
        <ModalHeader>P&L Timeframe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-between">
            <span>Select range</span>
            <DatePicker
              selectsRange={true}
              startDate={startDateModal}
              endDate={endDateModal}
              minDate={aYearAgo}
              maxDate={today.getTime()}
              onChange={update => {
                const start = update[0] ? update[0] : null;
                const end = update[1] ? update[1] : null;
                setStartDateModal(typeof start === "number" ? start : new Date(start).getTime());
                setEndDateModal(typeof end === "number" ? end : new Date(end).getTime());
              }}
              isClearable={true}
              placeholderText="Select timeframe"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-confirm"
            mr={3}
            onClick={async () => {
              setStartDate(startDateModal);
              setEndDate(endDateModal);
              setIsOpen(false);
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
