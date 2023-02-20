import React, { useEffect, useState } from 'react';
import { Col, PageWrapper, Row } from '@Components';
import { Button, Spinner } from '@chakra-ui/react';
import "./style.scss";
import { AddEventModal } from 'src/components/Modals/AddEventModal';
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

const daysOfTheWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const titles = {
  drops: "Upcoming Drops",
  spaces: "Twitter Spaces",
  raffles: "Personal Calendar",
  events: "IRL Events",
}

const chunkArrayInGroups = (arr, size) => {
  let myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

export const MonthlyCalendar = () => {
  const { address } = useAccount();
  const allowedAddresses = ["0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8","0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E","0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C"];
  const today = new Date();
  const {section} = useParams();
  const mainTitle = titles[section];
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var previousDate = new Date(year, date.getMonth()-1, 1)
    var nextDate = new Date(year, date.getMonth()+1 , 1)
    var days = [];
    var previousDays = [];
    var nextDays = [];
    while (date.getMonth() === month) {
      const isSelected = date.getMonth()===currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear() && date.getDate() === currentDate.getDate();
      isSelected ? days.push({date: new Date(date), isSelected: true}) : days.push({date: new Date(date)});
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
    if(days[0].date.getDay() !== 0) {
      const temp = previousDays.slice(previousDays.length - 6 , previousDays.length);
      const firstDayIndex = temp.findIndex((el)=>el.date.getDay() === 0);
      const firstDays = temp.slice(firstDayIndex);
      days.unshift(...firstDays);
    }
    /* add days of next month if needed */
    if(days[days.length-1].date.getDay() !== 6) {
      const temp = nextDays.slice(0,7);
      const lastDayIndex = temp.findIndex((el)=>el.date.getDay() === 6);
      const lastDays = temp.slice(0,lastDayIndex + 1);
      days.push(...lastDays);
    }

    return days;
  }


  const test = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const [allDaysInMonth, setAllDaysInMonth] = useState(test);
  const [daysInMonth, setDaysInMonth] = useState(chunkArrayInGroups(test,7))

  useEffect(()=>{
    if(isLoading){
      if(currentDate){
        setIsLoading(false);
      }
    }
  },[currentDate, isLoading])

  const changeDate = (back) => {
    setIsLoading(true);
    let nextDate = currentDate;
    if(back){
      nextDate.setMonth(currentDate.getMonth()-1)
    } else {
      nextDate.setMonth(currentDate.getMonth()+1)
    }
    setCurrentDate(nextDate)
    setAllDaysInMonth(getDaysInMonth(nextDate.getMonth(), nextDate.getFullYear()));
    setDaysInMonth(chunkArrayInGroups(getDaysInMonth(nextDate.getMonth(), nextDate.getFullYear()),7));
  }

  const renderMainTitle = () => (
    <Row className='main-title'>
      <h2>{mainTitle}</h2>
    </Row>
  )

  const renderMonthSwitch = () => (
    <Row className="calendar-month-switch-container">
      <h3>{currentDate.toLocaleString('en-GB', { month: 'long' }) + " " + currentDate.getFullYear()}</h3>
      <h3 className="calendar-month-switch" onClick={()=>changeDate(true)}>&lt;</h3>
      <h3 className="calendar-month-switch" onClick={()=>changeDate()}>&gt;</h3>
    </Row>
  )

  const renderHeader = () => (
    <Row className="calendar-row">
      {daysOfTheWeek.map((d)=>(
        <div className="calendar-header">
          <div>{d}</div>
        </div>
      ))}
    </Row>
  )

  const showSelectedDate = (d, idx) => {
    const allDaysInMonthCopy = [...allDaysInMonth];
    const todayIndex = allDaysInMonthCopy.findIndex((el=>el.isSelected));
    if(todayIndex !== -1) {
      allDaysInMonthCopy[todayIndex].isSelected = false
    }
    allDaysInMonthCopy[idx].isSelected = true;
    setSelectedDate(
      {title: d.date.toLocaleDateString('en-GB', { month: 'long'})
              +", "
              + d.date.toLocaleDateString('en-GB', { weekday: 'long' })
              +", "
              + d.date.getDate()
              +", "
              +d.date.getFullYear()
      }
    )
    console.log('allDaysInMonthCopy',allDaysInMonthCopy)
    setAllDaysInMonth(allDaysInMonthCopy);
  }

  const renderRow = (days, startIdx) => {
   const dayClass = (d) => {
    console.log('CHECK',d.isSelected, d.date)
    if(d.notCurrent) {
      if(d.isSelected){
        return "day-container not-curr-day today"
      }
      return "day-container not-curr-day"
    } else {
      if(d.isSelected){
        console.log('colorati',d)
        return "day-container today"
      }
      return "day-container"
    }
   }

    return (
    <Row className="calendar-row">
      {days?.map((d, index)=>(
        <div
          key={d.date.getDate().toString()}
          className={dayClass(d)}
          onClick={()=>showSelectedDate(d, index+startIdx)}
        >
          <div>{d.date.getDate()}</div>
        </div>
      ))}
    </Row>
  )}

  const renderlist = (
    <>
      {renderRow(daysInMonth[0], 0)}
      {renderRow(daysInMonth[1], 7)}
      {renderRow(daysInMonth[2], 14)}
      {renderRow(daysInMonth[3], 21)}
      {daysInMonth.length === 5 && renderRow(daysInMonth[4], 28)}
      {daysInMonth.length === 6 && renderRow(daysInMonth[5], 35)}
    </>
  )

  return (
      <div>
        {isLoading && <Spinner />}
        <AddEventModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
        <Row>
          <Col className="calendar-left-inner-container">
          {renderMonthSwitch()}
          {renderHeader()}
          {renderlist}
          </Col>

          <Col className="calendar-right-inner-container">
          {selectedDate ? (
          <div className="selected-date-detail">
            <div className="selected-date-title">{selectedDate?.title}</div>
            { allowedAddresses.includes(address) &&<Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>Add Event As Admin</Button>}
            <Button colorScheme={"blue"} className="button" onClick={onOpen}>Add Event</Button>
          </div>
          ) : (
            <div className='selected-date-title'>No day selected</div>
          )}
          </Col>
        </Row>
      </div>
  )
}