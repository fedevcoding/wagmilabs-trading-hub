import React, { useContext, useEffect } from "react";

import "./style.scss";

import { SocketContext } from "@Context";
import { useAccount } from "wagmi";
import { Header, NewTaskModal, Table } from "./components";
import { useHandleData, useGetData } from "./hooks";

const SniperBot = () => {
  const { activeSnipes, setActiveSnipes } = useGetData();
  const { showNewTask, toggleNewTaskModal, section, setSection, toggleSnipe, handleTaskUpdate } = useHandleData(
    activeSnipes,
    setActiveSnipes
  );

  const { address } = useAccount();
  const socket = useContext(SocketContext);
  useEffect(() => {
    if (address) {
      socket.emit("joinSnipeUpdates", address);

      socket.off("newSnipeUpdates").on("newSnipeUpdates", data => {
        handleTaskUpdate(data);
      });
    }

    return () => {
      socket.emit("leaveSnipeUpdates", address);
    };
  }, [socket, address, handleTaskUpdate]);

  return (
    <section className="sniper-bot-section">
      <Header section={section} setSection={setSection} toggleNewTaskModal={toggleNewTaskModal} />

      <NewTaskModal showNewTask={showNewTask} toggleNewTaskModal={toggleNewTaskModal} toggleSnipe={toggleSnipe} />

      <Table section={section} activeSnipes={activeSnipes} toggleSnipe={toggleSnipe} />
    </section>
  );
};

export default SniperBot;
