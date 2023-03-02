import React from "react";
import { IconLink } from "../IconLink";
import Delete from "../../../../assets/delete.svg";
import "./style.scss";

export const CalendarEventDetail = ({ event, deleteEvent, isAdmin }) => (
  <>
    <div className="calendar-event-detail">
      <div className="event-title-container">
        <span>
          {event?.eventName}
          {event?.collectionName}
          {event?.spaceName}
        </span>
        {isAdmin && (
          <img
            src={Delete}
            alt=""
            width="20px"
            className="delete-event"
            onClick={() => deleteEvent(event._id)}
          />
        )}
      </div>
      {event?.eventDescription && (
        <div className="event-tile">{event?.eventDescription}</div>
      )}
      {event?.spaceDescrition && (
        <div className="event-tile">{event?.spaceDescrition}</div>
      )}
      {event?.price && (
        <div className="event-tile">{`price: ${event?.price}`}</div>
      )}
      {event?.spaceHost && (
        <div className="event-tile">{`host: ${event?.spaceHost}`}</div>
      )}
      {event?.eventLocation && (
        <div className="event-tile">{`location: ${event?.eventLocation}`}</div>
      )}
      {event?.address && (
        <div className="event-tile">{`location: ${event?.address}`}</div>
      )}
      {event?.supply && (
        <div className="event-tile">{`supply: ${event?.supply}`}</div>
      )}
      {event?.links && (
        <>
          {Object.keys(event?.links).map(key => (
            <IconLink type={key} link={event?.links[key]} />
          ))}
        </>
      )}
    </div>
  </>
);
