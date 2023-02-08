import React, { useContext, useEffect, useMemo, useState } from "react";

import "./sniperbot.css";

import { Button } from "@chakra-ui/react";

import { UserDataContext } from "../../../context/userContext";
import NewTaskModal from "../../utility-components/NewTaskModal";
import { formatAddress } from "../../../utils/formats/formats";
import updateSnipeTasks from "../../../utils/database-functions/updateSnipeTasks";
import { SocketContext } from "../../../context/SocketContext";
import { useAccount } from "wagmi";

const SniperBot = () => {
  const { address } = useAccount();
  const [openNewTask, setOpenNewTask] = useState(false);
  const { snipingTasks, setSnipingTasks, currentSnipingTasks } =
    useContext(UserDataContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("joinPendingSnipes", address);

    socket.off("newPendingSnipe").on("newPendingSnipe", id => {
      pendingStatus(id);
    });

    return () => {
      socket.emit("leavePendingSnipes", address);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeTask(address, id) {
    updateSnipeTasks("remove", { address, id });
    const newTasks = snipingTasks.filter(task => task.id !== id);

    setSnipingTasks(newTasks);
  }

  function pendingStatus(id) {
    const newTasks = currentSnipingTasks.current;
    newTasks.forEach(task => {
      if (task.id === id) {
        task.status = "sniping";
      }
    });
    setSnipingTasks([...newTasks]);
  }

  const newTaskModal = () => {
    setOpenNewTask(true);
  };

  const closeTaskModal = (force, e) => {
    if (force) setOpenNewTask(false);
    else {
      if (e.target !== e.currentTarget) return;
      setOpenNewTask(false);
    }
  };

  const sniperTasksMapping = useMemo(
    () =>
      snipingTasks.map((task, index) => {
        const {
          address,
          maxFeePerGas,
          maxPriorityFeePerGas,
          maxItems,
          accountAddress,
          id,
          status,
        } = task;
        const { max } = task.price;

        return (
          <tr className="sniper-bot-single-task" key={index}>
            <td>
              <p>{formatAddress(address)}</p>
            </td>
            <td>
              <p>{max} ETH</p>
            </td>
            <td>
              <p>{maxItems}</p>
            </td>
            <td>
              <p> {formatAddress(accountAddress)}</p>
            </td>
            <td>
              <p> {status}</p>
            </td>
            <td>
              <p>max Fee per gas: {maxFeePerGas}</p>
              <p>max prio fee per gas: {maxPriorityFeePerGas}</p>
            </td>
            <td className="sniper-bot-cancel-task">
              <Button
                colorScheme={"red"}
                onClick={() => removeTask(address, id)}
              >
                Cancel
              </Button>
            </td>
          </tr>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snipingTasks]
  );

  return (
    <section className="sniper-bot-section">
      <div className="sniper-bot-sections">
        <div className="sniper-bot-sections-left">
          <button className="sniper-bot-sections-buttons active">
            Active tasks
          </button>
          <button className="sniper-bot-sections-buttons">Activity</button>
        </div>

        <div className="sniper-bot-option-buttons">
          <Button colorScheme="blue" onClick={newTaskModal}>
            New task
          </Button>
          <Button colorScheme="blue">Wallets</Button>
          <Button colorScheme="blue">Settings</Button>
        </div>
      </div>

      <div className="sniper-bot-task-table-wrapper">
        <table cellSpacing={0} className="sniper-bot-task-table">
          <thead>
            <tr>
              <th>Collection</th>

              <th>Trigger price</th>

              <th>QT.</th>

              <th>Account</th>

              <th>Status</th>

              <th>Gas</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>{sniperTasksMapping}</tbody>
        </table>
      </div>

      <NewTaskModal
        setOpenNewTask={setOpenNewTask}
        openNewTask={openNewTask}
        closeTaskModal={closeTaskModal}
        setSnipingTasks={setSnipingTasks}
        snipingTasks={snipingTasks}
      />
    </section>
  );
};

export default SniperBot;
