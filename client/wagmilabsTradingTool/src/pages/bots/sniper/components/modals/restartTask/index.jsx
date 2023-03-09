import React from "react";

export const RestartTaskModal = ({ showRestartTaskModal, restartModalData, closerestartModal, restartTask }) => {
  return (
    <>
      {showRestartTaskModal && (
        <>
          <div>Restart task {restartModalData.taskId}</div>
          <p>Select wallet</p>
        </>
      )}
    </>
  );
};
