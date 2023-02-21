import React from 'react';
import { Col, Row } from '@Components';
import "./style.scss";
import { AddEventModal } from 'src/components/Modals/AddEventModal';
import { Button, useDisclosure } from "@chakra-ui/react";
import { useAccount } from 'wagmi';

const daysOfTheWeak = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const hoursIntervals = [
  {val:"5:00",idx:5},
  {val:"6:00",idx:6},
  {val:"7:00",idx:7},
  {val:"8:00",idx:8},
  {val:"9:00",idx:9},
  {val:"10:00",idx:10},
  {val:"11:00",idx:11},
  {val:"12:00",idx:12},
  {val:"13:00",idx:13},
  {val:"14:00",idx:14},
  {val:"15:00",idx:15},
  {val:"16:00",idx:16},
  {val:"17:00",idx:17},
  {val:"18:00",idx:18},
  {val:"19:00",idx:19},
  {val:"20:00",idx:20},
  {val:"21:00",idx:21},
  {val:"22:00",idx:22},
  {val:"23:00",idx:23},
  {val:"00:00",idx:0},
  {val:"1:00",idx:1},
  {val:"2:00",idx:2},
  {val:"3:00",idx:3},
  {val:"4:00",idx:4},
]

const genSampleEvent = (year, month,date,hours,minutes) => (
  new Date(year, month,date,hours,minutes)
)

const sampleEvents = [
  {date: genSampleEvent(2023, 2, 26,12,30),title: "Domenica1",day:0, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 26,12,0),title: "Domenica2",day:0, hours: 6, minutes:0},
  {date: genSampleEvent(2023, 2, 26,12,30),title: "Domenica3",day:0, hours: 6, minutes: 30},
  {date: genSampleEvent(2023, 2, 26,12,30),title: "Domenica3",day:0, hours: 6, minutes: 30},
  {date: genSampleEvent(2023, 2, 26,12,30),title: "Domenica3",day:0, hours: 6, minutes: 30},
  {date: genSampleEvent(2023, 2, 26,12,30),title: "Domenica3",day:0, hours: 6, minutes: 30},
  {date: genSampleEvent(2023, 2, 20,12,30), title: "Daily dose", day:1, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 21,12,30), title: "Long text for a weekly event in Twitter spaces", day:2, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 22,12,30), title: "Long text for a weekly event in Twitter spaces", day:3, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 23,12,30), title: "Daily dose", day:4, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 24,12,30), title: "Long text for a weekly event in Twitter spaces",day:5, hours: 12, minutes: 30},
  {date: genSampleEvent(2023, 2, 25,12,30), title: "Long text for a weekly event in Twitter spaces",day:6, hours: 12, minutes: 30},
]

export const WeeklyCalendar = () => {
  const { address } = useAccount();
  const allowedAddresses = ["0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8","0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E","0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getEventsInWeekday = (weekDay) => (sampleEvents.filter((event)=>(event.day === weekDay)))
  const getAllEventsInAllWeakdays = () => (daysOfTheWeak.map((_, index)=>(getEventsInWeekday(index))))
  const allEventsInAllWeakdays = getAllEventsInAllWeakdays();
  const getAllHoursBlockUsedForEachWeakDay = () => {
    return allEventsInAllWeakdays.map((eventsInWeekDay) => {
      const distinctHoursinWeekDayEvents = eventsInWeekDay.map((el)=>el.hours).filter((value, index, array) => array.indexOf(value) === index);
      return distinctHoursinWeekDayEvents;
    })
  }

  const usedHoursBlocks = getAllHoursBlockUsedForEachWeakDay();

  const renderHeader = () => (
    <Row className="calendar-row">
      {daysOfTheWeak.map((d, dayIndex)=>(
        <div className="calendar-header">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginBottom: '8px'}}>{d}</div>
            {hoursIntervals.map((h)=>(
              <div style={{backgroundColor: usedHoursBlocks[dayIndex] && usedHoursBlocks[dayIndex].includes(h.idx) ? '#616161' : '#0E0F0E', height: '60px', borderRadius: '5px', width: '60px', textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap'}}>
                {getEventsInWeekday(dayIndex).map((event)=>(
                  <>
                  {event.hours === h.idx && <div style={{width: '60px', textOverflow: 'ellipsis', overflow: 'hidden',whiteSpace: 'nowrap'}}>{event.title}</div>}
                  </>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Row>
  )

  const renderSubtitle = () => (
    <Row className="weekly-calendar-subtitle">
      <h3>Weekly</h3>
    </Row>
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
          {renderSubtitle()}
          {renderHeader()}
          </Col>

          <Col className="calendar-right-inner-container">
          {true ? (
          <div className="selected-event-detail">
            <div className="selected-event-title">Selected Event</div>
            { allowedAddresses.includes(address) &&<Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>Add Event As Admin</Button>}
          </div>
          ) : (
            <div className='selected-event-title'>No day selected</div>
          )}
          </Col>
        </Row>
      </div>
  )
}