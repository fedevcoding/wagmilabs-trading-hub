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

export const Calendar = () => {
  const [sectionData, setSectionData] = useState([]);
  const data = useGetData();
  const {section} = useParams();
  const mainTitle = titles[section];

  const renderMainTitle = () => (
    <Row className='main-title'>
      <h2>{mainTitle}</h2>
    </Row>
  )
  
  useEffect(()=>{
    setSectionData(section === 'raffles' ? data.personal : data[section]);
  },[data, section])

  return (
    <PageWrapper page="calendar">
      {renderMainTitle()}
      {section === "spaces" ? (
        <WeeklyCalendar sectionData={sectionData} />
      ):(
        <MonthlyCalendar sectionData={sectionData} />
      )}
    </PageWrapper>
  )
}