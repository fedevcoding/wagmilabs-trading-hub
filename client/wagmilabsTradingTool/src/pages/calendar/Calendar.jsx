import React, { useEffect, useState } from 'react';
import { PageWrapper, Row } from '@Components';
import "./style.scss";
import { useParams } from 'react-router-dom';
import { MonthlyCalendar } from './Components/MonthlyCalendar';
import { WeeklyCalendar } from './Components/WeeklyCalendar';
import { useGetData } from "./useGetData";

const titles = {
  drops: "Upcoming Drops",
  spaces: "Twitter Spaces",
  raffles: "Personal Calendar",
  events: "IRL Events",
}

export const daysOfTheWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

export const hoursIntervals = [
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

export const getSelectedDateTitle = (selDate) => (`${selDate.toLocaleDateString('en-GB', { month: 'long'})}, ${selDate.toLocaleDateString('en-GB', { weekday: 'long' })}, ${selDate.getDate()}, ${selDate.getFullYear()}`)

export const Calendar = () => {
  const [sectionData, setSectionData] = useState(null);
  const data = useGetData();
  const {section} = useParams();
  const mainTitle = titles[section];

  const renderMainTitle = () => (
    <Row className='main-title'>
      <h2>{mainTitle}</h2>
    </Row>
  )
  
  useEffect(()=>{
    if(!data.isLoading){
      setSectionData(section === 'raffles' ? data.personal : data[section]);
    }
  },[data, section])

  return (
    <PageWrapper page="calendar">
      {renderMainTitle()}
      {sectionData && (
        <>
        {sectionData.length > 0 && section === "spaces" ? (
          <WeeklyCalendar sectionData={sectionData} />
        ):(
          <MonthlyCalendar sectionData={sectionData} />
        )}
        </>
      )}
    </PageWrapper>
  )
}