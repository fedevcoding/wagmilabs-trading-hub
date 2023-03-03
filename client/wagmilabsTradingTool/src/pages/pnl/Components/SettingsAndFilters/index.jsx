import { Button, TaxSettingsModal, TimeframeModal } from "@Components";
import moment from "moment";
import React from "react";

export const SettingsAndFilters = React.memo(({ startDate, endDate, setStartDate, setEndDate, ...settings }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenTimeframe, setIsOpenTimeframe] = React.useState(false);

  return (
    <>
      <Button className="btn-settings" onClick={() => setIsOpen(true)}>
        Tax settings <i className="fa-solid fa-gear" />
      </Button>
      <div>
        <p className="timeframe">
          Timeframe
          <br />
          {moment(startDate).format("MMM DD, YYYY")} - {moment(endDate).format("MMM DD, YYYY")}
        </p>
        <Button className="btn-settings" onClick={() => setIsOpenTimeframe(true)}>
          Change Timeframe
          <i className="fa-solid fa-clock" />
        </Button>
      </div>

      <TaxSettingsModal isOpen={isOpen} setIsOpen={setIsOpen} {...settings} />
      <TimeframeModal
        isOpen={isOpenTimeframe}
        setIsOpen={setIsOpenTimeframe}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </>
  );
});
