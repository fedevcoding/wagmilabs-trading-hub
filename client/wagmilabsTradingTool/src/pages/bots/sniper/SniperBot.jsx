import React, { useContext, useEffect, useState } from "react";

import "./style.scss";

import { SocketContext } from "@Context";
import { useAccount } from "wagmi";
import { Header, NewTaskModal, Table } from "./components";
import { useHandleData, useGetData } from "./hooks";

const SniperBot = () => {
  const { activeSnipes, setActiveSnipes } = useGetData();
  const { showNewTask, toggleNewTaskModal, section, setSection, toggleSnipe } = useHandleData(
    activeSnipes,
    setActiveSnipes
  );

  /*
  const { address } = useAccount();
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.emit("joinPendingSnipes", address);

    socket.off("newPendingSnipe").on("newPendingSnipe", id => {
      //   pendingStatus(id);
    });

    return () => {
      socket.emit("leavePendingSnipes", address);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  return (
    <section className="sniper-bot-section">
      <Header section={section} setSection={setSection} toggleNewTaskModal={toggleNewTaskModal} />

      <NewTaskModal showNewTask={showNewTask} toggleNewTaskModal={toggleNewTaskModal} toggleSnipe={toggleSnipe} />

      <Table section={section} activeSnipes={activeSnipes} toggleSnipe={toggleSnipe} />
    </section>
  );
};

export default SniperBot;
