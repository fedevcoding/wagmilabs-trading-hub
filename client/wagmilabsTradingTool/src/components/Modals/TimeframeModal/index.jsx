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
import { DatePicker, Select } from "@Components";

import "./style.scss";
import { useYearRange } from "./useYearRange";
import { useQuarterRange } from "./useQuarterRange";

export const TimeframeModal = React.memo(({ isOpen, setIsOpen, startDate, endDate, setStartDate, setEndDate }) => {
  const [startDateModal, setStartDateModal] = React.useState(startDate);
  const [endDateModal, setEndDateModal] = React.useState(endDate);
  const [typeRange, setTypeRange] = React.useState("custom");
  const { years, rangeYear, setRangeYear } = useYearRange();
  const { quarters, rangeQuarter, setRangeQuarter } = useQuarterRange();

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent className="timeframe-modal">
        <ModalHeader>P&L Timeframe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-between">
            <div>
              <input
                type="radio"
                name="range-type"
                value="custom"
                checked={typeRange === "custom"}
                onChange={e => setTypeRange(e.target.value)}
              />
              <span>Custom range</span>
            </div>
            <DatePicker
              selectsRange={true}
              startDate={startDateModal}
              endDate={endDateModal}
              maxDate={new Date().getTime()}
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
          <div className="space-between">
            <div>
              <input
                type="radio"
                name="range-type"
                value="year"
                checked={typeRange === "year"}
                onChange={e => setTypeRange(e.target.value)}
              />
              <span>Select year</span>
            </div>
            <Select
              id="set-year"
              onChange={v => {
                setRangeYear(v);
                setRangeQuarter(null);
              }}
              label="Set taxed on"
              value={rangeYear}
              options={years}
              isSearchable={false}
            />
          </div>
          <div className="space-between">
            <div>
              <input
                type="radio"
                name="range-type"
                value="quarter"
                checked={typeRange === "quarter"}
                onChange={e => setTypeRange(e.target.value)}
              />
              <span>Select quarter</span>
            </div>
            <Select
              id="set-quarter"
              onChange={v => {
                setRangeQuarter(v);
                setRangeYear(null);
              }}
              label="Set taxed on"
              value={rangeQuarter}
              options={quarters}
              isSearchable={false}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-confirm"
            mr={3}
            onClick={async () => {
              if (typeRange === "custom") {
                setStartDate(startDateModal);
                setEndDate(endDateModal);
              }
              if (typeRange === "year") {
                setStartDate(rangeYear.startDate);
                setEndDate(rangeYear.endDate);
              }
              if (typeRange === "quarter") {
                setStartDate(rangeQuarter.startDate);
                setEndDate(rangeQuarter.endDate);
              }
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
