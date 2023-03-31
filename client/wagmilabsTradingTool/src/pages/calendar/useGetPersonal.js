import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetPersonal() {
  const socket = useContext(SocketContext);
  const [personal, setPersonal] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);

    const personalUrl = `/personal`;

    const [{ personal }] = await Promise.all([getFromServer(personalUrl)]);

    setPersonal(personal);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [socket]);

  return { isLoading, personal, refetch: getData };
}
