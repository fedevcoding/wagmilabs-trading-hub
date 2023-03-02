import React, { useEffect } from "react";
import { Col, Row } from "@Components";
import { Button } from "@chakra-ui/react";
import { AddEventModal } from "src/components/Modals/AddEventModal";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { hoursIntervals } from "../../Calendar";
import { MonthSwitch } from "../MonthSwitch";
import { CalendarHeader } from "../CalendarHeader";
import { DayTile } from "../DayTile";
import { CalendarEventDetail } from "../CalendarEventDetail";
import moment from "moment";
import "./style.scss";
import { useMonthlyCalendar } from "./hooks/useMonthlyCalendar";

export const MonthlyCalendar = React.memo(
  ({ sectionData, section, refetch }) => {
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
    } = useMonthlyCalendar({sectionData, section, refetch});
    const renderRow = (days, startIdx) => (
      <>
        {!isLoading && (
          <AnimationOnScroll animateIn="animate__fadeInLeftBig" offset={0}>
            <Row className="calendar-row">
              {days?.map((d, index) => (
                <DayTile
                  day={d}
                  index={index}
                  startIdx={startIdx}
                  showSelectedDate={showSelectedDate}
                  sectionData={sectionData}
                />
              ))}
            </Row>
          </AnimationOnScroll>
        )}
      </>
    );

    const renderlist = () => (
      <>
        {renderRow(chunkDaysInMonth[0], 0)}
        {renderRow(chunkDaysInMonth[1], 7)}
        {renderRow(chunkDaysInMonth[2], 14)}
        {renderRow(chunkDaysInMonth[3], 21)}
        {chunkDaysInMonth.length === 5 && renderRow(chunkDaysInMonth[4], 28)}
        {chunkDaysInMonth.length === 6 && renderRow(chunkDaysInMonth[5], 35)}
      </>
    );

    useEffect(() => {
      if (
        moment(currentDate).format("YYYY-MM-DD") ===
        moment(today).format("YYYY-MM-DD")
      ) {
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

    const renderHourInterval = (h) => (
      (Math.min(...selectedEvents
        .map((el) => el.hour)) <= h.idx
      && Math.max(...selectedEvents
        .map((el) => el.hour)) >= h.idx)
      && <div className="hour-container-r">{h.val}</div>
    );

    const renderEventsInHour = h => {
      const eventsInHour = selectedEvents.filter(event => event.hour === h.idx);
      return (
        <>
          {eventsInHour.map(event => (
            <div className="selected-event-in-day">
              <div
                className="event-name"
                onClick={() => onEventDetails(event?._id)}
              >
                {event?.eventName || event?.collectionName}
              </div>
              {event._id === curEventDetail && (
                <div ref={ref}>
                  <CalendarEventDetail
                    event={event}
                    deleteEvent={deleteEvent}
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      );
    };

    const renderEventsInfo = () =>
      hoursIntervals.map(h => (
        <>
          {selectedEvents.length > 0 && (
            <>
              {renderHourInterval(h)}
              {renderEventsInHour(h)}

            </>
          )}
        </>
      ));

    return (
      <div>
        <AddEventModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          onSave={onSave}
          section={section}
        />
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
                {section === "personal" && (
                  <Button
                    colorScheme={"blue"}
                    className="button"
                    onClick={onOpen}
                  >
                    Add Event
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    colorScheme={"blue"}
                    className="button btn-spacing"
                    onClick={onOpen}
                  >
                    Add Event As Admin
                  </Button>
                )}
                {renderEventsInfo()}
              </div>
            ) : (
              <div className="selected-date-title">No day selected</div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
);
