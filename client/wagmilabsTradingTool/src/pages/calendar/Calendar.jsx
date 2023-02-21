import React from 'react';
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
  const data = useGetData();
  console.log('Calendar Data:', data)
  const {section} = useParams();
  const mainTitle = titles[section];

  const renderMainTitle = () => (
    <Row className='main-title'>
      <h2>{mainTitle}</h2>
    </Row>
  )

  return (
    <PageWrapper page="calendar">
      {renderMainTitle()}
      {section === "spaces" ? (
        <WeeklyCalendar />
      ):(
        <MonthlyCalendar />
      )}
    </PageWrapper>
  )
}