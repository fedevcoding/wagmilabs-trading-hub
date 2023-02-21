import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetData() {
  const socket = useContext(SocketContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      const dropsUrl = `/drops`;
      const eventsUrl = `/events`;
      const personalUrl = `/personal`;
      const spacesUrl = `/spaces`;

      const res = await Promise.all([
        getFromServer(dropsUrl),
        getFromServer(eventsUrl),
        getFromServer(personalUrl),
        getFromServer(spacesUrl),
      ]);
      console.log('GET DROPS RES: ', res)
      setLoading(false);
    }
    getData();
  }, [socket]);

  return { isLoading };
  // return { isLoading };
}