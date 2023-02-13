import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";

import "./style.scss";

import { UserDataContext } from "@Context/userContext";
import { useAccount } from "wagmi";
import updateSnipeTasks from "@Utils/database-functions/updateSnipeTasks";

export const NewTaskModal = ({
  openNewTask,
  closeTaskModal,
  setSnipingTasks,
  snipingTasks,
}) => {
  const { address } = useAccount();

  const { gasSettings } = useContext(UserDataContext);
  const defaultMaxFeePerGas = gasSettings.maxFeePerGas;
  const defaultMaxPriorityFeePerGas = gasSettings.maxPriorityFeePerGas;

  const defaultTaskInfo = {
    accountAddress: address,
    address: "",
    privateKey: "",
    status: "active",
    price: {
      min: 0,
      max: 0,
    },
    maxFeePerGas: defaultMaxFeePerGas,
    maxPriorityFeePerGas: defaultMaxPriorityFeePerGas,
    maxItems: 0,
    keyAddress: "",
    id: crypto.randomUUID(),
  };

  const [walletType, setWalletType] = useState("key");
  const [taskInfo, setTaskInfo] = useState(defaultTaskInfo);

  useEffect(() => {
    if (openNewTask) setTaskInfo(defaultTaskInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNewTask]);

  function saveTaskInfo() {
    updateSnipeTasks("create", taskInfo);
    const task = [taskInfo, ...snipingTasks];
    setSnipingTasks(task);
    closeTaskModal(true);
  }

  function updateTaskInfo(e, type, isEvent) {
    let value;
    if (isEvent) value = e.target.value;
    else value = e;

    switch (type) {
      case "address":
        setTaskInfo(prev => ({ ...prev, address: value }));
        break;
      case "min":
        setTaskInfo(prev => ({
          ...prev,
          price: { ...prev.price, min: value },
        }));
        break;
      case "max":
        setTaskInfo(prev => ({
          ...prev,
          price: { ...prev.price, max: value },
        }));
        break;
      case "privateKey":
        setTaskInfo(prev => ({ ...prev, privateKey: value }));
        break;
      case "maxFeeGas":
        setTaskInfo(prev => ({ ...prev, maxFeePerGas: value }));
        break;
      case "maxPriorityFeeGas":
        setTaskInfo(prev => ({ ...prev, maxPriorityFeePerGas: value }));
        break;
      case "maxItems":
        setTaskInfo(prev => ({ ...prev, maxItems: value }));
        break;
      default:
        break;
    }
  }

  return (
    <>
      {openNewTask && (
        <div
          className="new-task-modal-overlay"
          onClick={e => closeTaskModal(false, e)}
        >
          <div className="new-task-modal-wrapper">
            <header className="new-task-modal-header">
              <p>NEW TASK</p>
            </header>

            <div>
              Collection address
              <HStack>
                <Input
                  placeholder="address"
                  color={"white"}
                  onChange={e => updateTaskInfo(e, "address", true)}
                />
              </HStack>
            </div>

            <div>
              Price
              <HStack>
                <Input
                  placeholder="Min"
                  color={"white"}
                  onChange={e => updateTaskInfo(e, "min", true)}
                />
                <span>-</span>
                <Input
                  placeholder="Max"
                  color={"white"}
                  onChange={e => updateTaskInfo(e, "max", true)}
                />
              </HStack>
            </div>

            <div>
              <RadioGroup onChange={setWalletType} value={walletType}>
                <Stack direction="row">
                  <Radio value="key">Private key</Radio>
                  <Radio value="wallet">Wallet</Radio>
                </Stack>
              </RadioGroup>

              {walletType === "key" ? (
                <HStack>
                  <Input
                    placeholder="Private key"
                    color={"white"}
                    onChange={e => updateTaskInfo(e, "privateKey", true)}
                  />
                </HStack>
              ) : (
                <Select
                  style={{ color: "white" }}
                  onChange={e => updateTaskInfo(e, "privateKey", true)}
                >
                  <WalletMappings updateTaskInfo={updateTaskInfo} />
                </Select>
              )}
            </div>

            <div>
              Max Fee Per Gas
              <HStack>
                <Input
                  placeholder="1.5"
                  color={"white"}
                  onChange={e => updateTaskInfo(e, "maxFeeGas", true)}
                  defaultValue={defaultMaxFeePerGas}
                />
              </HStack>
              Max Priority Fee Per Gas
              <HStack>
                <Input
                  placeholder="30"
                  color={"white"}
                  onChange={e => updateTaskInfo(e, "maxPriorityFeeGas", true)}
                  defaultValue={defaultMaxPriorityFeePerGas}
                />
              </HStack>
            </div>

            <div>
              MAX AUTO BUY
              <NumberInput>
                <HStack>
                  <NumberInputField
                    placeholder="N. items"
                    color={"white"}
                    onChange={e => updateTaskInfo(e, "maxItems", true)}
                  />
                  <Button onClick={saveTaskInfo}>Save</Button>
                </HStack>
              </NumberInput>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const WalletMappings = ({ updateTaskInfo }) => {
  const stringifiedWallets = localStorage.getItem("wallets");
  const wallets = JSON.parse(stringifiedWallets);

  useEffect(() => {
    setTimeout(() => {
      const privateKey = wallets[0].key;
      updateTaskInfo(privateKey, "privateKey", false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {useMemo(
        () =>
          wallets?.map(wallet => {
            return (
              <option
                key={crypto.randomUUID()}
                value={wallet.key}
                style={{ background: "black" }}
              >
                {wallet.name}
              </option>
            );
          }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      )}
    </>
  );
};
