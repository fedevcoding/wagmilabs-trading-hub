import { useEffect, useState, useContext } from "react";
import { getFromServer } from "@Utils/functions/serverCalls.js";
import { SocketContext } from "@Context";

export function useGetDrops() {
  const socket = useContext(SocketContext);
  const [drops, setDrops] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);

    const dropsUrl = `/drops`;

    const [{ drops }] = await Promise.all([getFromServer(dropsUrl)]);

    setDrops(drops);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [socket]);

  return { isLoading, drops, refetch: getData };
}
