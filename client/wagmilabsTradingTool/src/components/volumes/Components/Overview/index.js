import React from "react";
import { Col, LoadingSpinner, Row } from "../../../utility-components";
import { Volumes, Traders, LeaderBoard } from "./Components";
import { useGetData } from "./useGetData";

import "./style.css";

export const Overview = React.memo(({ marketplaces }) => {
  const defaultPeriod = "24H";
  const { volumes, traders, leaderBoard } = useGetData(
    marketplaces,
    defaultPeriod
  );

  return (
    <div className="overview">
      <Row>
        <Col>
          {(volumes && (
            <Volumes
              marketplaces={marketplaces}
              volumes={volumes}
              period={defaultPeriod}
            />
          )) || <LoadingSpinner />}
        </Col>
        <Col>
          {(traders && (
            <Traders
              marketplaces={marketplaces}
              traders={traders}
              period={defaultPeriod}
            />
          )) || <LoadingSpinner />}
        </Col>
      </Row>
      <Row>
        <Col>
          {(leaderBoard && (
            <LeaderBoard
              marketplaces={marketplaces}
              leaderBoard={leaderBoard}
              period={defaultPeriod}
            />
          )) || <LoadingSpinner />}
        </Col>
      </Row>
    </div>
  );
});
