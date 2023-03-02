import React from "react";
import moment from "moment";
import "./style.scss";

const dayClass = d => {
  if (d.notCurrent) {
    if (d.isSelected) {
      return "day-container not-curr-day selected-tile";
    }
    return "day-container not-curr-day";
  } else {
    if (d.isSelected) {
      return "day-container selected-tile";
    }
    return "day-container";
  }
};

const renderEventName = (event, date) => {
  if (
    moment(event?.timestamp).format("YYYY-MM-DD") ===
    moment(date).format("YYYY-MM-DD")
  ) {
    return (
      <div className="day-event-name">
        {event?.collectionName || event?.eventName}
      </div>
    );
  }
};

export const DayTile = ({
  day,
  index,
  startIdx,
  showSelectedDate,
  sectionData,
}) => (
  <div
    key={day.date.getDate().toString()}
    className={dayClass(day)}
    onClick={() => showSelectedDate(day, index + startIdx)}
  >
    <div>{day.date.getDate()}</div>
    {sectionData.map(event => renderEventName(event, day.date))}
  </div>
);
