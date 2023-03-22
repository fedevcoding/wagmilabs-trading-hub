import { useState, useCallback } from "react";

export const useHandleData = (activeSnipes, setActiveSnipes) => {
  const [section, setSection] = useState("active");

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);

  const [restartTaskModalData, setRestartTaskModalData] = useState({
    show: false,
  });

  const toggleNewTaskModal = state => {
    setShowNewTask(state);
  };

  const toggleDeleteTaskModal = state => {
    setShowDeleteTask(state);
  };

  const toggleSnipe = useCallback(
    (state, data) => {
      if (state === "add") {
        setActiveSnipes(oldTasks => [data, ...oldTasks]);
      }
      if (state === "remove") {
        setActiveSnipes(oldTasks => {
          const newTasks = oldTasks.filter(snipe => snipe.taskId !== data);
          return newTasks;
        });
      }
      if (state === "restart") {
        setActiveSnipes(oldTasks => {
          const newTasks = oldTasks.map(task => {
            if (task.taskId === data.taskId) {
              return { ...task, status: "active", walletAddress: data.walletAddress };
            }
            return { ...task };
          });

          return newTasks;
        });
      }
    },
    [setActiveSnipes]
  );

  const handleTaskUpdate = useCallback(
    data => {
      const { properties, taskId, remaining } = data;

      if (remaining === 1) {
        toggleSnipe("remove", taskId);
      } else {
        setActiveSnipes(oldSnipes => {
          const newTasks = oldSnipes.map(task => {
            if (task.taskId === taskId) {
              const newTask = { ...task };

              properties.forEach(property => {
                const { key, value } = property;
                newTask[key] = value;
              });
              return newTask;
            }
            return { ...task };
          });
          return newTasks;
        });
      }
    },
    [toggleSnipe, setActiveSnipes]
  );

  return {
    showNewTask,
    showDeleteTask,
    toggleNewTaskModal,
    toggleDeleteTaskModal,
    toggleSnipe,
    section,
    setSection,
    handleTaskUpdate,
    restartTaskModalData,
    setRestartTaskModalData,
  };
};
