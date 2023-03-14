import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetEvents() {
  const socket = useContext(SocketContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);

    const eventsUrl = `/events`;

    const [{events}] = await Promise.all([
      getFromServer(eventsUrl),
    ]);
    
    setEvents(events);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [socket]);

  return {isLoading, events, refetch: getData};
}