import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "@Components";
import { AddEventModal } from "src/components/Modals/AddEventModal";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { getSelectedDateTitle, hoursIntervals } from "../../Calendar";
import { WeeklyScheduler } from "../WeeklyScheduler";
import { WeeklySubtitle } from "../WeeklySubtitle";
import { CalendarEventDetail } from "../CalendarEventDetail";
import { pushToServer, deleteFromServer } from "../../../../utils/functions";
import moment from "moment";
import "./style.scss";
import { useOnClickOutside } from "@Hooks";
import { adminAddresses } from "@Utils/adminAddresses";

export const WeeklyCalendar = ({ sectionData, refetch }) => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const { address } = useAccount();
  const isAdmin = adminAddresses.includes(address);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [curEventDetail, setCurEventDetail] = useState(null);
  const ref = useRef();
  useOnClickOutside(ref, () => setCurEventDetail(null));
  
  const showSelectedDate = d => {
    setSelectedDate({ title: getSelectedDateTitle(d, true), date: d });
  };

  const deleteEvent = async id => {
    await deleteFromServer("/spaces", { id });
    refetch();
  };

  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(
        sectionData
          .filter(
            event =>
              moment(event.timestamp).format("d") ===
              moment(selectedDate.date).format("d")
          )
          .map(el => ({ ...el, hour: moment(el.timestamp).hours() }))
          .sort(({ hour: a }, { hour: b }) => a - b)
      );
    }
  }, [sectionData, selectedDate]);

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
              {event?.spaceName}
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

  const onSave = async params => {
    try {
      await pushToServer("/spaces", { ...params, wallet: address });
      onClose();
      refetch();
    } catch (err) {
      console.log("error on Save: ", err);
      onClose();
    }
  };

  return (
    <div>
      <AddEventModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        section="spaces"
        onSave={onSave}
        isAdmin={isAdmin}
      />
      <Row>
        <Col className="calendar-hours-inner-container">
          {hoursIntervals.map(h => (
            <div className="calendar-hour">{h.val}</div>
          ))}
        </Col>
        <Col className="calendar-center-inner-container">
          <WeeklySubtitle />
          <WeeklyScheduler
            hoursIntervals={hoursIntervals}
            sectionData={sectionData}
            selectedDay={selectedDate}
            setSelectedDay={setSelectedDate}
            showSelectedDate={showSelectedDate}
          />
        </Col>

        <Col className="calendar-right-inner-container">
          {selectedDate ? (
            <div className="selected-event-detail">
              <div className="selected-event-title">{selectedDate?.title}</div>
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
            <>
              {isAdmin ? (
                <Button
                  colorScheme={"blue"}
                  className="button btn-spacing"
                  onClick={onOpen}
                >
                  Add Event As Admin
                </Button>
              ) : (
                <div>No event selected</div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
