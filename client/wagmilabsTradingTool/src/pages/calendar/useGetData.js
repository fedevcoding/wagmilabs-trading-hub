import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetData() {
  const socket = useContext(SocketContext);
  const [drops, setDrops] = useState([]);
  const [events, setEvents] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      const dropsUrl = `/drops`;
      const eventsUrl = `/events`;
      const personalUrl = `/personal`;
      const spacesUrl = `/spaces`;

      const [{drops}, {events}, {personal}, {spaces}] = await Promise.all([
        getFromServer(dropsUrl),
        getFromServer(eventsUrl),
        getFromServer(personalUrl),
        getFromServer(spacesUrl),
      ]);
      
      setDrops(drops);
      setEvents(events);
      setPersonal(personal);
      setSpaces(spaces);
      setLoading(false);
    }
    getData();
  }, [socket]);

  return { isLoading, drops, events, personal, spaces };
}