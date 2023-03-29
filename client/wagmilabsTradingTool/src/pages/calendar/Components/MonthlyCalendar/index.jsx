import React, { useEffect } from "react";
import { Col, Row } from "@Components";
import { Button } from "@chakra-ui/react";
import { AddEventModal } from "src/components/Modals/AddEventModal";
import { hoursIntervals } from "../../Calendar";
import { MonthSwitch } from "../MonthSwitch";
import { CalendarHeader } from "../CalendarHeader";
import { DayTile } from "../DayTile";
import { CalendarEventDetail } from "../CalendarEventDetail";
import moment from "moment";
import "./style.scss";
import { useMonthlyCalendar } from "./hooks/useMonthlyCalendar";

export const MonthlyCalendar = React.memo(({ sectionData, section, refetch }) => {
  const {
    isLoading,
    showSelectedDate,
    chunkDaysInMonth,
    currentDate,
    today,
    curEventDetail,
    setCurEventDetail,
    selectedEvents,
    ref,
    deleteEvent,
    isAdmin,
    isOpen,
    onClose,
    onOpen,
    onSave,
    changeDate,
    selectedDate,
    slideLeft,
    getEventsInDay,
  } = useMonthlyCalendar({ sectionData, section, refetch });

  const renderRow = (days, startIdx) => (
    <>
      {!isLoading && (
        <>
          <Row className={`calendar-row ${slideLeft ? "animate-left" : "animate-right"}`}>
            {days?.map((d, index) => (
              <DayTile
                key={JSON.stringify(d)}
                day={d}
                index={index}
                startIdx={startIdx}
                showSelectedDate={showSelectedDate}
                events={getEventsInDay(sectionData, d.date)}
              />
            ))}
          </Row>
        </>
      )}
    </>
  );

  const renderlist = () => (
    <>
      {renderRow(chunkDaysInMonth[0], 0)}
      {renderRow(chunkDaysInMonth[1], 7)}
      {renderRow(chunkDaysInMonth[2], 14)}
      {renderRow(chunkDaysInMonth[3], 21)}
      {chunkDaysInMonth.length > 4 && renderRow(chunkDaysInMonth[4], 28)}
      {chunkDaysInMonth.length > 5 && renderRow(chunkDaysInMonth[5], 35)}
      {chunkDaysInMonth.length > 6 && renderRow(chunkDaysInMonth[6], 42)}
    </>
  );

  useEffect(() => {
    if (moment(currentDate).format("YYYY-MM-DD") === moment(today).format("YYYY-MM-DD")) {
      showSelectedDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEventDetails = eventId => {
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
  };

  const renderHourInterval = h =>
    Math.min(...selectedEvents.map(el => el.hour)) <= h.idx &&
    Math.max(...selectedEvents.map(el => el.hour)) >= h.idx && <div className="hour-container-r">{h.val}</div>;

  const renderEventsInHour = h => {
    const eventsInHour = selectedEvents.filter(event => event.hour === h.idx);
    return (
      <>
        {eventsInHour.map(event => (
          <div className="selected-event-in-day" key={JSON.stringify(event)}>
            <div className="event-name" onClick={() => onEventDetails(event?._id)}>
              {event?.eventName || event?.collectionName}
            </div>
            {event._id === curEventDetail && (
              <div ref={ref}>
                <CalendarEventDetail event={event} deleteEvent={deleteEvent} isAdmin={isAdmin} section={section} />
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderEventsInfo = () =>
    hoursIntervals.map(h => (
      <React.Fragment key={JSON.stringify(h)}>
        {selectedEvents.length > 0 && (
          <>
            {renderHourInterval(h)}
            {renderEventsInHour(h)}
          </>
        )}
      </React.Fragment>
    ));

  return (
    <div>
      <AddEventModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onSave={onSave}
        section={section}
        selectedDate={selectedDate}
        isAdmin={isAdmin}
      />
      <Row>
        <Col className="calendar-left-inner-container">
          <MonthSwitch currentDate={currentDate} changeDate={changeDate} />
          <div>
            <CalendarHeader />
            {renderlist()}
          </div>
        </Col>

        <Col className="calendar-right-inner-container-m">
          <div className="selected-date-detail">
            <div className="selected-date-title">{selectedDate?.title}</div>
            {section === "personal" ? (
              <Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>
                {isAdmin ? "Add Event As Admin" : "Add Event"}
              </Button>
            ) : (
              isAdmin && (
                <Button colorScheme={"blue"} className="button btn-spacing" onClick={onOpen}>
                  Add event as admin
                </Button>
              )
            )}
            {renderEventsInfo()}
          </div>
        </Col>
      </Row>
    </div>
  );
});
