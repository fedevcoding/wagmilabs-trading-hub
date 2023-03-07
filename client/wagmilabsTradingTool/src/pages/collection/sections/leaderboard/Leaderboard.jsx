import React from "react";

import "./style.scss";
import { useGetData } from "./useGetData";

const Leaderboard = () => {
  const { holders } = useGetData();

  console.log("holders", holders);

  return <div id="leaderboard">Work in progress...</div>;
};

export default Leaderboard;
