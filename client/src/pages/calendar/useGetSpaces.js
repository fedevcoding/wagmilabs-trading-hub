import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetSpaces() {
  const socket = useContext(SocketContext);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);

    const spacesUrl = `/spaces`;

    const [{ spaces }] = await Promise.all([getFromServer(spacesUrl)]);

    setSpaces(spaces);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [socket]);

  return { isLoading, spaces, refetch: getData };
}
