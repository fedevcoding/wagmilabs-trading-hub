import React from "react";
import { IconLink } from "../IconLink";
import Delete from "../../../../assets/delete.svg";
import "./style.scss";

export const CalendarEventDetail = ({ event, deleteEvent, isAdmin, section }) => (
  <>
    <div className="calendar-event-detail">
      <div className="event-title-container">
        <span>
          {event?.eventName}
          {event?.collectionName}
          {event?.spaceName}
        </span>
        {(isAdmin || (section === "personal" && event.isAdmin)) && (
          <img src={Delete} alt="" width="20px" className="delete-event" onClick={() => deleteEvent(event._id)} />
        )}
      </div>
      {event?.eventDescription && <div className="event-tile">{event?.eventDescription}</div>}
      {event?.spaceDescription && <div className="event-tile">{event?.spaceDescription}</div>}
      {event?.price && <div className="event-tile">{`PRICE: ${event?.price}`}</div>}
      {event?.spaceHost && <div className="event-tile">{`HOST: ${event?.spaceHost}`}</div>}
      {event?.eventLocation && <div className="event-tile">{`LOCATION: ${event?.eventLocation}`}</div>}
      {event?.supply && <div className="event-tile">{`SUPPLY: ${event?.supply}`}</div>}
      {event?.links && (
        <>
          {Object.keys(event?.links).map(key => (
            <React.Fragment key={key}>{key && <IconLink type={key} link={event?.links[key]} />}</React.Fragment>
          ))}
        </>
      )}
    </div>
  </>
);
