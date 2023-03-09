import { Button, HStack } from "@chakra-ui/react";
import { formatAddress } from "@Utils";
import React from "react";
import { useEditTask } from "../../hooks/useEditTask";
import { RestartTaskModal } from "../modals";

export const Table = ({
  section,
  activeSnipes,
  toggleSnipe,
  showRestartTaskModal,
  restartModalData,
  setRestartModalData,
  toggleRestartTaskModal,
}) => {
  const { removeTask, restartTask } = useEditTask(undefined, toggleSnipe);

  const openRestartModal = taskId => {
    setRestartModalData({ taskId });
    toggleRestartTaskModal(true);
  };

  const closerestartModal = () => {
    setRestartModalData({});
    toggleRestartTaskModal(false);
  };

  return (
    <div className="table-wrapper">
      <RestartTaskModal
        showRestartTaskModal={showRestartTaskModal}
        restartModalData={restartModalData}
        closerestartModal={closerestartModal}
        restartTask={restartTask}
      />
      <table cellSpacing={0} className="table">
        <thead>
          <tr>
            {section === "active" ? (
              <>
                <th>Collection</th>

                <th>Trigger price</th>

                <th>QT.</th>

                <th>Remaining</th>

                <th>Account</th>

                <th>Status</th>

                <th>Gas</th>

                <th>Action</th>
              </>
            ) : (
              <>
                <th>Collection</th>
                <th>Buy price</th>
                <th>Account</th>
                <th>Status</th>
                <th>Gas</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {section === "active" &&
            activeSnipes?.map((snipe, index) => {
              const {
                collectionName,
                collectionImage,
                maxPrice,
                maxAutoBuy,
                walletAddress,
                maxPriorityFeePerGas,
                maxFeePerGas,
                status,
                taskId,
                remaining,
              } = snipe;
              return (
                <tr key={index}>
                  <td>
                    <HStack className="name-container">
                      <img src={collectionImage} alt="collection" />
                      <p>{collectionName}</p>
                    </HStack>
                  </td>
                  <td>{maxPrice} ETH</td>
                  <td>{maxAutoBuy}</td>
                  <td>{remaining}</td>
                  <td>{formatAddress(walletAddress)}</td>
                  <td>{status}</td>
                  <td>
                    <HStack flexDirection={"column"}>
                      <p>Max priority: {maxPriorityFeePerGas}</p>
                      <p>Max fee per gas: {maxFeePerGas || "auto"}</p>
                    </HStack>
                  </td>
                  <td>
                    {status === "inactive" && <Button onClick={() => openRestartModal(taskId)}>Restart</Button>}
                    <Button className="btn btn-danger" onClick={() => removeTask(taskId)}>
                      Cancel
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
