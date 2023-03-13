// window options: 1d, 3d, 7d, 30d, 90d

import { useState } from "react";

export const useTimeframes = () => {
  const [interval] = useState("daily");
  const [window, setWindow] = useState("1d");

  const changeWindow = window => {
    setWindow(window);
  };

  return { interval, window, changeWindow };
};
