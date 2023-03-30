import React from "react";
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

const renderEventName = event => <div className="day-event-name">{event?.collectionName || event?.eventName}</div>;

export const DayTile = ({ day, index, startIdx, showSelectedDate, events }) => {
  console.log("events", events);
  return (
    <div className={dayClass(day)} onClick={() => showSelectedDate(day, index + startIdx)}>
      <div>{day.date.getDate()}</div>
      {events
        .filter(e => e)
        .map(e => (
          <React.Fragment key={JSON.stringify(e)}>{renderEventName(e)}</React.Fragment>
        ))}
      {events.length > 2 && <div>{`+ ${events.length - 2} more`}</div>}
    </div>
  );
};
