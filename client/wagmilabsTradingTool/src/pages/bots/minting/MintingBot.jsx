import React, { useContext, useEffect } from "react";

import "./style.scss";

import { SocketContext } from "@Context";
import { useAccount } from "wagmi";
import { Header, NewTaskModal, Table } from "./components";
import { useHandleData, useGetData } from "./hooks";
import { useSecurePro } from "../../../custom-hooks/useSecurePro";

const SniperBot = () => {
  useSecurePro();

  const { activeMints, setActiveMints, mintsActivity, loadingMints } = useGetData();
  const {
    showNewTask,
    toggleNewTaskModal,
    section,
    setSection,
    toggleSnipe,
    // handleTaskUpdate,
    restartTaskModalData,
    setRestartTaskModalData,
  } = useHandleData(activeMints, setActiveMints);

  // const { address } = useAccount();
  // const socket = useContext(SocketContext);
  // useEffect(() => {
  //   if (address && socket && handleTaskUpdate) {
  //     socket.emit("joinSnipeUpdates", address);

  //     socket.off("newSnipeUpdates").on("snipeUpdates", data => {
  //       handleTaskUpdate(data);
  //     });
  //   }

  //   return () => {
  //     socket.emit("leaveSnipeUpdates", address);
  //   };
  // }, [socket, address, handleTaskUpdate]);

  return (
    <section className="minting-bot-section">
      <Header section={section} setSection={setSection} toggleNewTaskModal={toggleNewTaskModal} />

      <NewTaskModal showNewTask={showNewTask} toggleNewTaskModal={toggleNewTaskModal} toggleSnipe={toggleSnipe} />

      <Table
        section={section}
        activeMints={activeMints}
        toggleSnipe={toggleSnipe}
        restartTaskModalData={restartTaskModalData}
        setRestartTaskModalData={setRestartTaskModalData}
        mintsActivity={mintsActivity}
        loadingMints={loadingMints}
      />
    </section>
  );
};

export default SniperBot;
