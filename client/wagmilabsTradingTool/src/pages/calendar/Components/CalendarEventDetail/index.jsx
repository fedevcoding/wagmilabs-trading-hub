import React from 'react'
import { IconLink } from '../IconLink'
import './style.scss'

export const CalendarEventDetail = ({event}) => (
  <>
    <div className='calendar-event-detail'>
      <div>{event?.eventName}{event?.collectionName}{event?.spaceName}</div>
      <div className='arrow-right'></div>
      <div className="event-tile">
        {event?.eventDescription || event?.spaceDescrition || `price: ${event?.price}`}
      </div>
      {event?.spaceHost && (
        <div className="event-tile">{`host: ${event?.spaceHost}`}</div>
      )}
      {event?.eventLocation && (
        <div className="event-tile">{`location: ${event?.eventLocation}`}</div>
      )}
      {event?.supply && (
        <div className="event-tile">{`supply: ${event?.supply}`}</div>
      )}
      {event?.links && (
        <>
        {Object.keys(event?.links).map((key) => (
          <IconLink type={key} link={event?.links[key]} />
        ))}
        </>
      )}
    </div>
  </>
)