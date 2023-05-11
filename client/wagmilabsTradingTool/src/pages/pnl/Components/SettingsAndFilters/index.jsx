import { Button, TaxSettingsModal, TimeframeModal } from "@Components";
import moment from "moment";
import React, { useContext } from "react";
import { downloadPnlImage, exportData } from "./functions";
import { getRecap } from "../CardRecap/function";
import { UserDataContext } from "../../../../context/userContext";

export const SettingsAndFilters = React.memo(
  ({
    startDate,
    endDate,
    taxPerc,
    taxedOn,
    currency,
    setStartDate,
    taxLossHarvesting,
    longTermTax,
    setEndDate,
    data,
    address,
    ...settings
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenTimeframe, setIsOpenTimeframe] = React.useState(false);

    const { profileImage } = useContext(UserDataContext);

    const { paid, sold, pAndL, taxes } = getRecap(data, taxPerc, taxedOn, taxLossHarvesting, longTermTax);

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
          <div>
            <div />
            <Button
              className="btn-settings btn-export"
              onClick={() => downloadPnlImage(data, paid, sold, pAndL, taxes, address, profileImage)}
            >
              Share PNL
              <i className="fa-solid fa-share" />
            </Button>
            <Button
              className="btn-settings btn-export"
              onClick={() => exportData(data, settings.taxedOn, settings.taxPerc, settings.longTermTax)}
            >
              Export data
              <i className="fa-solid fa-download" />
            </Button>
            <Button className="btn-settings" onClick={() => setIsOpenTimeframe(true)}>
              Change Timeframe
              <i className="fa-solid fa-clock" />
            </Button>
          </div>
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
  }
);
