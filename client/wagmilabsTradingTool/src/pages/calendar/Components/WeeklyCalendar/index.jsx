import React, { useEffect, useState } from 'react';
import { Col, Row } from '@Components';
import { AddEventModal } from 'src/components/Modals/AddEventModal';
import { Button, useDisclosure } from "@chakra-ui/react";
import { useAccount } from 'wagmi';
import { getSelectedDateTitle, hoursIntervals} from '../../Calendar';
import { WeeklyScheduler } from '../WeeklyScheduler';
import { WeeklySubtitle } from '../WeeklySubtitle';
import { CalendarEventDetail } from '../CalendarEventDetail';
import moment from 'moment';
import "./style.scss";

export const WeeklyCalendar = ({sectionData}) => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const { address } = useAccount();
  const allowedAddresses = ["0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8","0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E","0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [curEventDetail, setCurEventDetail] = useState(null);
  const showSelectedDate = (d) => {
    setSelectedDate(
      {title: getSelectedDateTitle(d),
        date: d,
      }
    )
  }

  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(
      sectionData
        .filter((event) => (moment(event.timestamp).format('YYYY-MM-DD') === moment(selectedDate.date).format('YYYY-MM-DD')))
        .map((el) => ({...el, hour: moment(el.timestamp).hours()}))
        .sort(({hour:a}, {hour:b}) => a-b)
      )
    }
  },[sectionData, selectedDate])

   const onEventDetails = (eventId) => {
    if (eventId) {
      if (curEventDetail) {
        if (curEventDetail === eventId) {
          setCurEventDetail(null);
        } else {
          setCurEventDetail(eventId);
        }
      } else {
        setCurEventDetail(eventId);
      }
    } else {
      if (curEventDetail) {
        setCurEventDetail(null);
      }
    }
  }

 const renderEventsInHour = (h) => {
  const eventsInHour = selectedEvents.filter((event) => (event.hour === h.idx))
  return (
    <>
    {eventsInHour.map((event) => (
      <div className="selected-event-in-day">
        <div className='event-name' onClick={() =>onEventDetails(event?._id)}>{event?.spaceName}</div>
        {event._id === curEventDetail && (
          <CalendarEventDetail event={event} />
        )}
      </div>
  ))}
  </>
  )
}

 const renderEventsInfo = () => (
  hoursIntervals.map((h) => (
    <>
    {selectedEvents.length >0 && (
      <>
      {h.idx === selectedEvents[0].hour && <div>{h.val}</div>}
      {renderEventsInHour(h)}
      {(h.idx === selectedEvents[selectedEvents.length-1].hour + 1) && <div>{h.val}</div>}
      </>
    )}
    </>
  ))
 )

  return (
    <div>
      <AddEventModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      <Row>
        <Col className="calendar-hours-inner-container">
          {hoursIntervals.map((h)=>(
            <div className="calendar-hour">{h.val}</div>
          ))}
        </Col>
        <Col className="calendar-center-inner-container">
        <WeeklySubtitle />
        <WeeklyScheduler hoursIntervals={hoursIntervals} sectionData={sectionData} selectedDay={selectedDate} setSelectedDay={setSelectedDate} showSelectedDate={showSelectedDate} />
        </Col>

        <Col className="calendar-right-inner-container">
        {selectedDate ? (
        <div className="selected-event-detail">
          <div className="selected-event-title">{selectedDate?.title}</div>
          { allowedAddresses.includes(address) &&<Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>Add Event As Admin</Button>}
          {renderEventsInfo()}
        </div>
        ) : (
          <div className='selected-event-title'>No events selected</div>
        )}
        </Col>
      </Row>
    </div>
  )
}