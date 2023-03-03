import React, { useContext, useEffect, useState } from "react";

import "./style.scss";

import { SocketContext } from "@Context";
import { useAccount } from "wagmi";
import { Header, NewTaskModal, Table } from "./components";
import { useHandleData } from "./hooks";

const SniperBot = () => {
  const { showNewTask, showDeleteTask, toggleNewTask, toggleDeleteTask } = useHandleData();

  const { address } = useAccount();
  const [section, setSection] = useState("active");

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

  return (
    <section className="sniper-bot-section">
      <Header section={section} setSection={setSection} toggleNewTask={toggleNewTask} />

      <NewTaskModal showNewTask={showNewTask} toggleNewTask={toggleNewTask} />

      <Table section={section} />
    </section>
  );
};

export default SniperBot;
