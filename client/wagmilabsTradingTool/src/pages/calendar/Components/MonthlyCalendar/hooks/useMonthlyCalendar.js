import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { getSelectedDateTitle } from "../../../Calendar";
import { chunkArrayInGroups } from "src/utils/formats/utils";
import moment from "moment";
import { pushToServer, deleteFromServer } from "../../../../../utils/functions";
import { useOnClickOutside } from "@Hooks";
import { getDaysInMonth } from "./useGetDaysInMonth";

export const useMonthlyCalendar = ({sectionData, section, refetch}) => {
  const { address } = useAccount();
  const allowedAddresses = [
    "0x8d50Ca23bDdFCA6DB5AE6dE31ca0E6A17586E5B8",
    "0xfe697C5527ab86DaA1e4c08286D2bE744a0E321E",
    "0x7FAC7b0161143Acfd80257873FB9cDb3F316C10C",
  ];
  const [slideLeft, setSlideLeft] = useState(true);
  const isAdmin = allowedAddresses.includes(address);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [curEventDetail, setCurEventDetail] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  useOnClickOutside(ref, () => setCurEventDetail(null));

  const deleteEvent = async id => {
    await deleteFromServer("/" + section, { id });
    refetch();
  };

  const initDaysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear(),
    false,
    today
  );
  const [allDaysInMonth, setAllDaysInMonth] = useState(initDaysInMonth);
  const [chunkDaysInMonth, setChunkDaysInMonth] = useState(
    chunkArrayInGroups(initDaysInMonth, 7)
  );

  useEffect(() => {
    if (isLoading) {
      if (currentDate) {
        setIsLoading(false);
      }
    }
  }, [currentDate, isLoading]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(
        sectionData
          .filter(
            event =>
              moment(event.timestamp).format("YYYY-MM-DD") ===
              moment(selectedDate.date).format("YYYY-MM-DD")
          )
          .map(el => ({ ...el, hour: moment(el.timestamp).hours() }))
          .sort(({ hour: a }, { hour: b }) => a - b)
      );
    }
  }, [sectionData, selectedDate]);

  const onSave = async params => {
    try {
      await pushToServer("/" + section, params);
      onClose();
      refetch();
    } catch (err) {
      console.log("error on Save: ", err);
      onClose();
    }
  };

  const changeDate = back => {
    if(slideLeft !== back) setSlideLeft(back);
    setIsLoading(true);
    setCurEventDetail(null);
    let nextDate = new Date(currentDate.getTime());
    if (back) {
      nextDate.setMonth(currentDate.getMonth() - 1);
    } else {
      nextDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(new Date(nextDate.getTime()));
    const isToday =
      moment(nextDate).format("YYYY-MM-DD") ===
      moment(today).format("YYYY-MM-DD");
    const nextAllDaysInMonth = getDaysInMonth(
      nextDate.getMonth(),
      nextDate.getFullYear(),
      !isToday,
      today,
    );
    setAllDaysInMonth(nextAllDaysInMonth);
    const nextDaysInMonth = chunkArrayInGroups(nextAllDaysInMonth, 7);
    setChunkDaysInMonth(nextDaysInMonth);
    if (!isToday) {
      setSelectedDate(null);
    } else {
      setSelectedDate({ title: getSelectedDateTitle(today), date: today });
    }
  };

  const showSelectedDate = (d, idx) => {
    const allDaysInMonthCopy = [...allDaysInMonth];
    if (idx > 0) {
      const oldSelectedIdx = allDaysInMonthCopy.findIndex(
        el => el.isSelected
      );
      if (oldSelectedIdx !== -1) {
        allDaysInMonthCopy[oldSelectedIdx].isSelected = false;
      }
      allDaysInMonthCopy[idx].isSelected = true;
      setSelectedDate({ title: getSelectedDateTitle(d.date), date: d.date });
    } else if (currentDate === today && !idx) {
      setSelectedDate({ title: getSelectedDateTitle(today), date: today });
    }
    setAllDaysInMonth(allDaysInMonthCopy);
  };

  const getEventsInDay = (sectionData, date) => sectionData?.filter((el)=>moment(el?.timestamp).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"))

  return({
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
  })
}