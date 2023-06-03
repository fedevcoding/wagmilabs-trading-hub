import { useState, useEffect } from "react";

export const useRefreshTime = time => {
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(!refresh);
    }, time);

    return () => clearInterval(interval);
  }, [refresh, time]);
  return refresh;
};
