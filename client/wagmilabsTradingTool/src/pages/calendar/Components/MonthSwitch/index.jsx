import { Row } from "@Components";
import React from "react";
import "./style.scss";

export const MonthSwitch = ({ currentDate, changeDate }) => (
  <Row className="calendar-month-switch-container">
    <h3>{`${currentDate.toLocaleString("en-GB", {
      month: "long",
    })} ${currentDate.getFullYear()}`}</h3>
    <h3 className="calendar-month-switch" onClick={() => changeDate(true)}>
      &lt;
    </h3>
    <h3 className="calendar-month-switch" onClick={() => changeDate()}>
      &gt;
    </h3>
  </Row>
);
