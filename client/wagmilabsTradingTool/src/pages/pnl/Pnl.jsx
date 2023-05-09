import React, { useEffect } from "react";
import { Card, Col, LoadingSpinner, PageWrapper, Row } from "@Components";
import { CardRecap, SettingsAndFilters, Table } from "./Components";
import { useSetPageTitle } from "@Hooks";
import { testBanner } from "@Assets";
import "./style.scss";
import { useTimeframe } from "./useTimeframe";
import { useGetData } from "./useGetData";
import { useSettings } from "./useSettings";
import { useAccount } from "wagmi";
import { formatAddress } from "../../utils/formats/formats";

export default React.memo(() => {
  const { address } = useAccount();
  useSetPageTitle("Portfolio P&L | Wagmi Labs");
  const { startDate, endDate, setStartDate, setEndDate } = useTimeframe();
  const { data, isLoading } = useGetData(address, startDate, endDate);
  const settings = useSettings();

  function draw() {
    const canvas = document.createElement("canvas");
    canvas.height = 700;
    canvas.width = 700;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = testBanner;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.font = "20px serif";
      ctx.fillText("PNL", 75, 570);
      ctx.fillText("Spent", 250, 570);
      ctx.fillText(formatAddress(address), 70, 655);
      download(canvas, "test.png");
    };
  }
  // useEffect(draw, [address]);

  function download(canvas, filename) {
    var lnk = document.createElement("a");
    lnk.download = filename;
    lnk.href = canvas.toDataURL("image/png;base64");
    lnk.click();
  }

  return (
    <PageWrapper page="pnl">
      <h1>Portfolio P&L</h1>
      <Row>
        <Col>
          <CardRecap
            data={data}
            taxPerc={settings.taxPerc}
            currency={settings.currency.value}
            taxedOn={settings.taxedOn.value}
            taxLossHarvesting={settings.taxLossHarvesting}
            longTermTax={settings.longTermTax}
          />
        </Col>
        <Col className="text-right settings">
          <SettingsAndFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            data={data}
            {...settings}
          />
        </Col>
      </Row>
      <Card>
        {!isLoading && data ? (
          <Table
            data={data}
            taxPerc={settings.taxPerc}
            taxedOn={settings.taxedOn.value}
            currency={settings.currency.value}
            longTermTax={settings.longTermTax}
            isLoading={isLoading}
          />
        ) : (
          <LoadingSpinner />
        )}
      </Card>
    </PageWrapper>
  );
});
