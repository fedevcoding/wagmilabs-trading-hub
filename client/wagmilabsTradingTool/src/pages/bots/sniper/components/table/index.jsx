import { Button, HStack } from "@chakra-ui/react";
import { ActionModal, Loader } from "@Components";
import { formatAddress } from "@Utils";
import React from "react";
import { placeholderImage } from "@Assets";
import { useEditTask } from "../../hooks/useEditTask";
import moment from "moment";
import { notFound } from "src/assets";

export const Table = ({
  section,
  activeSnipes,
  toggleSnipe,
  restartTaskModalData,
  setRestartTaskModalData,
  snipeActivity,
  loadingSnipes,
}) => {
  const { removeTask, restartTask } = useEditTask(undefined, toggleSnipe);

  const opendModal = id => {
    setRestartTaskModalData({ show: true, id, privateKey: null, walletAddress: null, walletType: "privatekey" });
  };

  return (
    <div className="table-wrapper">
      <table cellSpacing={0} className="table">
        <ActionModal
          data={restartTaskModalData}
          action={restartTask}
          setData={setRestartTaskModalData}
          type={"restartBotSnipe"}
        />
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
                <th>Token ID</th>
                <th>Buy price</th>
                <th>Account</th>
                <th>Status</th>
                <th>Date</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {loadingSnipes ? (
            <div className="loading-container">
              <p>Loading...</p>
              <Loader width={"25px"} height={"25px"} notAbsolute={true}></Loader>
            </div>
          ) : (
            <>
              {section === "active" ? (
                activeSnipes?.length === 0 ? (
                  <div className="not-found-container">
                    <img src={notFound} alt="not found"></img>
                    <p>No active snipes</p>
                  </div>
                ) : (
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
                            <img src={collectionImage || placeholderImage} alt="collection" />
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
                            <p>Max gas: {maxFeePerGas || "auto"}</p>
                          </HStack>
                        </td>
                        <td>
                          {status === "inactive" && <Button onClick={() => opendModal(taskId)}>Restart</Button>}
                          <Button className="btn btn-danger" onClick={() => removeTask(taskId)}>
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )
              ) : (
                <>
                  {snipeActivity?.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="not-found-container">
                          <img src={notFound} alt="not found"></img>
                          <p>No snipes activity</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    snipeActivity?.map((snipe, index) => {
                      const {
                        eventTimestamp,
                        tokenId,
                        buyPrice,
                        walletAddress,
                        collectionImage,
                        collectionName,
                        status,
                      } = snipe;

                      const time = moment(eventTimestamp).format("DD/MM/YYYY HH:mm");
                      return (
                        <tr key={index}>
                          <td>
                            <HStack className="name-container">
                              <img src={collectionImage || placeholderImage} alt="collection" />
                              <p>{collectionName}</p>
                            </HStack>
                          </td>
                          <td>{tokenId}</td>
                          <td>{buyPrice} ETH</td>
                          <td>{formatAddress(walletAddress)}</td>
                          <td>{status}</td>
                          {/* <td>{gasPrice} ETH</td> */}
                          <td>{time}</td>
                        </tr>
                      );
                    })
                  )}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
