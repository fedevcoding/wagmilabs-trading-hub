import React from "react";
import { Col, LoadingSpinner, Row } from "../../../utility-components";
import { Volumes, Traders } from "./Components";
import { useGetData } from "./useGetData";

import "./style.css";

export const Overview = React.memo(({ marketplaces }) => {
  const defaultPeriod = "24H";
  const { volumes, traders } = useGetData(marketplaces, defaultPeriod);

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
    </div>
  );
});
