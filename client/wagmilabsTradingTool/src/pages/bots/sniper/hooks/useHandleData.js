import { useState } from "react";

export const useHandleData = (activeSnipes, setActiveSnipes) => {
  const [section, setSection] = useState("active");

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showRestartTaskModal, setShowRestartTaskModal] = useState(false);
  const [restartModalData, setRestartModalData] = useState({});

  const toggleNewTaskModal = state => {
    setShowNewTask(state);
  };

  const toggleDeleteTaskModal = state => {
    setShowDeleteTask(state);
  };

  const toggleSnipe = (state, data) => {
    if (state === "add") {
      const newTasks = [data, ...activeSnipes];
      setActiveSnipes(newTasks);
    }
    if (state === "remove") {
      const newTasks = activeSnipes.filter(snipe => snipe.taskId !== data);
      setActiveSnipes(newTasks);
    }
    if (state === "restart") {
      const newTasks = activeSnipes.map(task => {
        if (task.taskId === data) {
          return { ...task, status: "active" };
        }
        return { ...task };
      });
      setActiveSnipes(newTasks);
    }
  };

  const handleTaskUpdate = data => {
    const { properties, taskId } = data;

    const newTasks = activeSnipes.map(task => {
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
    setActiveSnipes(newTasks);
  };

  const toggleRestartTaskModal = state => {
    setShowRestartTaskModal(state);
  };

  return {
    showNewTask,
    showDeleteTask,
    toggleNewTaskModal,
    toggleDeleteTaskModal,
    toggleSnipe,
    section,
    setSection,
    handleTaskUpdate,
    showRestartTaskModal,
    toggleRestartTaskModal,
    restartModalData,
    setRestartModalData,
  };
};
