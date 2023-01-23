import React from "react";
import { Col, LoadingSpinner, Row } from "../../../utility-components";
import { ActiveTraders, Comparison, Sales, Volumes } from "./Components";

import "./style.css";

export const Markets = React.memo(({ marketplace }) => {
  const defaultPeriod = "24H";

  const { volumes, sales, activeTraders, comparisonData } = {
    volumes: {},
    sales: {},
    activeTraders: {},
    comparisonData: {},
  };

  return (
    <div className={`markets market-${marketplace}`}>
      <Row>
        <Col>
          {(volumes && (
            <Volumes
              marketplace={marketplace}
              volumes={volumes}
              period={defaultPeriod}
            />
          )) || (
            <div className="empty-box">
              <LoadingSpinner />
            </div>
          )}
        </Col>
        <Col>
          {(sales && (
            <Sales
              marketplace={marketplace}
              sales={sales}
              period={defaultPeriod}
            />
          )) || (
            <div className="empty-box">
              <LoadingSpinner />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {(activeTraders && (
            <ActiveTraders
              marketplace={marketplace}
              activeTraders={activeTraders}
              period={defaultPeriod}
            />
          )) || (
            <div className="empty-box">
              <LoadingSpinner />
            </div>
          )}
        </Col>
        <Col>
          {(comparisonData && (
            <Comparison
              marketplace={marketplace}
              comparisonData={comparisonData}
              period={defaultPeriod}
            />
          )) || (
            <div className="empty-box">
              <LoadingSpinner />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
});
