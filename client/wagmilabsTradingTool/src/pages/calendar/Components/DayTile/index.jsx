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

const renderEvents = events => {
  events
    ?.map((event, index) => {
      if (index < 2) return renderEventName(event);
      else return undefined;
    })
    ?.filter(e => e !== undefined);
};

const renderEventName = event => <div className="day-event-name">{event?.collectionName || event?.eventName}</div>;

export const DayTile = ({ day, index, startIdx, showSelectedDate, events }) => {
  return (
    <div
      key={day.date.getDate().toString()}
      className={dayClass(day)}
      onClick={() => showSelectedDate(day, index + startIdx)}
    >
      <div>{day.date.getDate()}</div>
      {renderEvents(events)}
      {events.length > 2 && <div>{`+ ${events.length - 2} more`}</div>}
    </div>
  );
};
