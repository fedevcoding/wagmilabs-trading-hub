import React from "react";
import { PageWrapper, Row } from "@Components";
import "./style.scss";
import { useParams } from "react-router-dom";
import { MonthlyCalendar } from "./Components/MonthlyCalendar";
import { WeeklyCalendar } from "./Components/WeeklyCalendar";
import { useGetDrops } from "./useGetDrops";
import { useGetEvents } from "./useGetEvents";
import { useGetSpaces } from "./useGetSpaces";
import { useGetPersonal } from "./useGetPersonal";
import { setPageTitle } from "@Utils";

const titles = {
  drops: "Upcoming Drops",
  spaces: "Twitter Spaces",
  raffles: "Personal Calendar",
  events: "IRL Events",
};

export const daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const hoursIntervals = [
  { val: "5:00", idx: 5 },
  { val: "6:00", idx: 6 },
  { val: "7:00", idx: 7 },
  { val: "8:00", idx: 8 },
  { val: "9:00", idx: 9 },
  { val: "10:00", idx: 10 },
  { val: "11:00", idx: 11 },
  { val: "12:00", idx: 12 },
  { val: "13:00", idx: 13 },
  { val: "14:00", idx: 14 },
  { val: "15:00", idx: 15 },
  { val: "16:00", idx: 16 },
  { val: "17:00", idx: 17 },
  { val: "18:00", idx: 18 },
  { val: "19:00", idx: 19 },
  { val: "20:00", idx: 20 },
  { val: "21:00", idx: 21 },
  { val: "22:00", idx: 22 },
  { val: "23:00", idx: 23 },
  { val: "00:00", idx: 0 },
  { val: "1:00", idx: 1 },
  { val: "2:00", idx: 2 },
  { val: "3:00", idx: 3 },
  { val: "4:00", idx: 4 },
];

export const getSelectedDateTitle = (selDate, weekly) => {
  if(weekly) {
    return `${selDate.toLocaleDateString("en-GB", {
      weekday: "long",
    })}`;
  }
  return `${selDate.toLocaleDateString("en-GB", {
    month: "long",
  })}, ${selDate.toLocaleDateString("en-GB", {
    weekday: "long",
  })}, ${selDate.getDate()}, ${selDate.getFullYear()}`;
}

const getPageTitle = (section) => {
  switch (section) {
    case "drops":
      return "NFT Drops | Wagmi Labs";
    case "spaces":
      return "Twitter Spaces | Wagmi Labs";
    case "raffles":
      return "Personal | Wagmi Labs";
    case "events":
      return "IRL Events | Wagmi Labs";
    default:
      return;
  }
}

export const Calendar = () => {
  const { drops, refetch: dropsRefetch } = useGetDrops();
  const { events, refetch: eventsRefetch } = useGetEvents();
  const { personal, refetch: personalRefetch } = useGetPersonal();
  const { spaces, refetch: spacesRefetch } = useGetSpaces();
  const { section } = useParams();
  const mainTitle = titles[section];
  setPageTitle(getPageTitle(section));

  const renderMainTitle = () => (
    <Row className="main-title">
      <h2>{mainTitle}</h2>
    </Row>
  );

  return (
    <PageWrapper page="calendar">
      {renderMainTitle()}
        <>
          {spaces && section === "spaces" && (
            <WeeklyCalendar sectionData={spaces} refetch={spacesRefetch} />
          )}
          {drops && section === "drops" &&
          (
            <MonthlyCalendar
              sectionData={drops}
              section={section}
              refetch={dropsRefetch}
            />
          )}
          {events && section === "events" &&
          (
            <MonthlyCalendar
              sectionData={events}
              section={section}
              refetch={eventsRefetch}
            />
          )}
          {personal && section === "raffles" &&
          (
            <MonthlyCalendar
              sectionData={personal.map((s)=>s.events).flat()}
              section="personal"
              refetch={personalRefetch}
            />
          )}
        </>
    </PageWrapper>
  );
};
