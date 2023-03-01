import React, { useEffect, useState } from "react";
import { Row } from "@Components";
import "./style.scss";
import moment from "moment";
import { daysOfTheWeek } from "../../Calendar";

export const WeeklyScheduler = React.memo(
  ({ hoursIntervals, sectionData, showSelectedDate }) => {
    const getEventsInWeekday = weekDay =>
      sectionData.filter(el => moment(el?.timestamp)?.day() === weekDay);

    const getAllEventsInAllWeakdays = () =>
      daysOfTheWeek.map((_, index) => getEventsInWeekday(index));

    const allEventsInAllWeakdays = getAllEventsInAllWeakdays();

    const getUsedHoursBlocks = () =>
      allEventsInAllWeakdays.map(eventsInWeekDay =>
        eventsInWeekDay
          .map(el => moment(el?.timestamp).hours())
          .filter((value, index, array) => array.indexOf(value) === index)
          .map(el => ({ hour: el }))
      );
      
    const [usedHoursBlocks, setUsedHoursBlocks] = useState(
      getUsedHoursBlocks()
    );

    const onSelectDate = date => {
      showSelectedDate(date);
      setUsedHoursBlocks(prev =>
        prev.map((el, index) => {
          if (index === date.getDay()) {
            const next = el.map(el => {
              if (el.hour === date.getHours()) {
                return { ...el, isSel: true };
              } else {
                if (el.isSel) {
                  return { ...el, isSel: false };
                }
                return el;
              }
            });
            return next;
          } else {
            return el;
          }
        })
      );
    };

    useEffect(() => {
      if (sectionData) {
        setUsedHoursBlocks(getUsedHoursBlocks());
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sectionData])

    const activeHourClass = d => {
      console.log("activeHourClass day", d);
      if (d?.isSel) {
        return "active-hour-section selected-hour";
      }
      return "active-hour-section";
    };

    return (
      <Row className="calendar-row">
        {daysOfTheWeek.map((d, dayIndex) => (
          <div className="weekday-calendar-column">
            <div className="weekday-calendar-inner-column">
              <div className="weekday-col-title">{d}</div>
              {hoursIntervals.map(h => (
                <div
                  className={
                    usedHoursBlocks[dayIndex] &&
                    usedHoursBlocks[dayIndex]
                      ?.map(el => el?.hour)
                      .includes(h.idx)
                      ? activeHourClass(
                          usedHoursBlocks[dayIndex].find(
                            el => el.hour === h.idx
                          )
                        )
                      : "hour-section"
                  }
                >
                  {getEventsInWeekday(dayIndex).map(event => (
                    <>
                      {moment(event?.timestamp).hours() === h.idx && (
                        <div
                          className="hour-slot"
                          onClick={() =>
                            onSelectDate(moment(event?.timestamp)?.toDate())
                          }
                        >
                          {event?.spaceName}
                        </div>
                      )}
                    </>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Row>
    );
  }
);
