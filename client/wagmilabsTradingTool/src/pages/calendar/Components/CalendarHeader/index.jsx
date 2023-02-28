import { Row } from "@Components";
import React from "react";
import { daysOfTheWeek } from "../../Calendar";
import "./style.scss";

export const CalendarHeader = () => (
  <Row className="calendar-row">
    {daysOfTheWeek.map(d => (
      <div className="calendar-header">
        <div>{d}</div>
      </div>
    ))}
  </Row>
);
