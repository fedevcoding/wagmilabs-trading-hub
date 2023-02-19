import React from 'react';
import { Col, PageWrapper, Row } from '@Components';
import "./style.scss";

const daysOfTheWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const chunkArrayInGroups = (arr, size) => {
  let myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

export const Calendar = () => {
  const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var previousDate = new Date(year, date.getMonth()-1, 1)
    var nextDate = new Date(year, date.getMonth()+1 , 1)
    var days = [];
    var previousDays = [];
    var nextDays = [];
    while (date.getMonth() === month) {
      days.push({date: new Date(date)});
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

  const daysInMonth = chunkArrayInGroups(getDaysInMonth(1,2023),7);

  const renderHeader = () => (
    <Row className="calendar-row">
      {daysOfTheWeek.map((d)=>(
        <div className="calendar-header">
          <div>{d}</div>
        </div>
      ))}
    </Row>
  )
  const renderRow = (days) => {
    return (
    <Row className="calendar-row">
      {days?.map((d)=>(
        <div className={d.notCurrent ? "day-container not-curr-day" : "day-container"}>
          <div>{d.date.getDate()}</div>
        </div>
      ))}
    </Row>
  )}

  const renderlist = (
    <>
      {renderRow(daysInMonth[0])}
      {renderRow(daysInMonth[1])}
      {renderRow(daysInMonth[2])}
      {renderRow(daysInMonth[3])}
      {daysInMonth.length === 5 && renderRow(daysInMonth[4])}
      {daysInMonth.length === 6 && renderRow(daysInMonth[5])}
    </>
  )

  return (
    <PageWrapper page="calendar">
      <div className="calendar">
        <Row>
          <Col className="calendar-left-inner-container">
          {renderHeader()}
          {renderlist}
          </Col>

          <Col className="calendar-right-inner-container">
          <div>Sunday, February 19, 2023</div>
          </Col>
        </Row>
      </div>
    </PageWrapper>
  )
}