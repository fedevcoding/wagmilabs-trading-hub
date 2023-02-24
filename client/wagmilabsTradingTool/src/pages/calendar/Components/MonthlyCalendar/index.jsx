import React, { useEffect, useState } from 'react';
import { Col, Row } from '@Components';
import { Button } from '@chakra-ui/react';
import { AddEventModal } from 'src/components/Modals/AddEventModal';
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import { getSelectedDateTitle, hoursIntervals } from '../../Calendar';
import { chunkArrayInGroups } from 'src/utils/formats/utils';
import { MonthSwitch } from '../MonthSwitch';
import { CalendarHeader } from '../CalendarHeader';
import { DayTile } from '../DayTile';
import { CalendarEventDetail } from '../CalendarEventDetail';
import moment from "moment";
import "./style.scss";


export const MonthlyCalendar = React.memo(({sectionData}) => {
  const { address } = useAccount();
  const allowedAddresses = ["0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8","0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E","0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C"];
  const today = new Date();
  const {section} = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [curEventDetail, setCurEventDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getDaysInMonth = (month, year, changedDate) => {
    var date = new Date(year, month, 1);
    var previousDate = new Date(year, date.getMonth()-1, 1)
    var nextDate = new Date(year, date.getMonth() + 1 , 1)
    var days = [];
    var previousDays = [];
    var nextDays = [];
    while (date.getMonth() === month) {
      const isSelected = date.getMonth()===today.getMonth() && date.getFullYear() === today.getFullYear() && date.getDate() === today.getDate();
      isSelected ? days.push({date: new Date(date), isSelected: !changedDate}) : days.push({date: new Date(date)});
      date.setDate(date.getDate() + 1);
    }
    while (previousDate.getMonth() === month - 1) {
      previousDays.push({date: new Date(previousDate), notCurrent: true});
      previousDate.setDate(previousDate.getDate() + 1);
    }
    while (nextDate.getMonth() === month + 1) {
      nextDays.push({date: new Date(nextDate), notCurrent: true});
      nextDate.setDate(nextDate.getDate() + 1);
    }
    /* add days of previous month if needed */
    if (days[0].date.getDay() !== 0) {
      const temp = previousDays.slice(previousDays.length - 6 , previousDays.length);
      const firstDayIndex = temp.findIndex((el) =>el.date.getDay() === 0);
      const firstDays = temp.slice(firstDayIndex);
      days.unshift(...firstDays);
    }
    /* add days of next month if needed */
    if (days[days.length-1].date.getDay() !== 6) {
      const temp = nextDays.slice(0,7);
      const lastDayIndex = temp.findIndex((el) =>el.date.getDay() === 6);
      const lastDays = temp.slice(0,lastDayIndex + 1);
      days.push(...lastDays);
    }

    return days;
  }


  const initDaysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const [allDaysInMonth, setAllDaysInMonth] = useState(initDaysInMonth);
  const [chunkDaysInMonth, setChunkDaysInMonth] = useState(chunkArrayInGroups(initDaysInMonth,7))

  useEffect(() => {
    if (isLoading) {
      if (currentDate) {
        setIsLoading(false);
      }
    }
  },[currentDate, isLoading])

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

  const changeDate = (back) => {
    setIsLoading(true);
    setCurEventDetail(null);
    let nextDate = new Date(currentDate.getTime())
    if (back) {
      nextDate.setMonth(currentDate.getMonth()-1)
    } else {
      nextDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(new Date(nextDate.getTime()))
    const isToday = moment(nextDate).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD');
    const nextAllDaysInMonth = getDaysInMonth(nextDate.getMonth(), nextDate.getFullYear(), !isToday);
    setAllDaysInMonth(nextAllDaysInMonth);
    const nextDaysInMonth = chunkArrayInGroups(nextAllDaysInMonth,7);
    setChunkDaysInMonth(nextDaysInMonth);
    if (!isToday) {
      setSelectedDate(null)
    } else {
      setSelectedDate(
        {title: getSelectedDateTitle(today),
         date: today,
        }
      )
    }

  }

  const showSelectedDate = (d, idx) => {
    const allDaysInMonthCopy = [...allDaysInMonth];
    if (idx>0) {
      const oldSelectedIdx = allDaysInMonthCopy.findIndex((el=>el.isSelected));
      if (oldSelectedIdx !== -1) {
        allDaysInMonthCopy[oldSelectedIdx].isSelected = false
      }
      allDaysInMonthCopy[idx].isSelected = true;
      setSelectedDate(
        {title: getSelectedDateTitle(d.date),
          date: d.date,
        }
      )
    } else if (currentDate === today && !idx) {
      setSelectedDate(
        {title: getSelectedDateTitle(today),
          date: today,
        }
      )
    }
    setAllDaysInMonth(allDaysInMonthCopy);
  }

  const renderRow = (days, startIdx) => (
    <>
    {!isLoading && 
      (
        <AnimationOnScroll animateIn="animate__fadeInLeftBig" offset={0}>
          <Row className="calendar-row">
            {days?.map((d, index) => (
              <DayTile day={d} index={index} startIdx={startIdx} showSelectedDate={showSelectedDate} sectionData={sectionData} />
            ))}
          </Row>
        </AnimationOnScroll>
      )
    }
    </>
  )

  const renderlist = () => (
    <>
      {renderRow(chunkDaysInMonth[0], 0)}
      {renderRow(chunkDaysInMonth[1], 7)}
      {renderRow(chunkDaysInMonth[2], 14)}
      {renderRow(chunkDaysInMonth[3], 21)}
      {chunkDaysInMonth.length === 5 && renderRow(chunkDaysInMonth[4], 28)}
      {chunkDaysInMonth.length === 6 && renderRow(chunkDaysInMonth[5], 35)}
    </>
  )

  useEffect(() => {
    if (moment(currentDate).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')) {
      showSelectedDate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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
          <div className='event-name' onClick={() =>onEventDetails(event?._id)}>{event?.eventName || event?.collectionName}</div>
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
          <Col className="calendar-left-inner-container">
          <MonthSwitch currentDate={currentDate} changeDate={changeDate} />
          <CalendarHeader />
          {renderlist()}
          </Col>

          <Col className="calendar-right-inner-container-m">
          {selectedDate ? (
          <div className="selected-date-detail">
            <div className="selected-date-title">{selectedDate?.title}</div>
            { section === "raffles" && <Button colorScheme={"blue"} className="button" onClick={onOpen}>Add Event</Button>}
            { allowedAddresses.includes(address) &&<Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>Add Event As Admin</Button>}
            {renderEventsInfo()}
          </div>
          ) : (
            <div className='selected-date-title'>No day selected</div>
          )}
          </Col>
        </Row>
      </div>
  )
})