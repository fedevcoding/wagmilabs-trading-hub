import React from "react";
import { useNavigate } from "react-router-dom";
const { Button, HStack } = require("@chakra-ui/react");

export const Header = ({ section, setSection, toggleNewTaskModal }) => {
  const navigate = useNavigate();

  const changeSection = section => {
    setSection(section);
  };

  return (
    <div className="options">
      <div className="options-left">
        <button className={`${section === "active" && "active"}`} onClick={() => changeSection("active")}>
          Active tasks
        </button>
        <button className={`${section === "activity" && "active"}`} onClick={() => changeSection("activity")}>
          Activity
        </button>
      </div>

      <div className="options-right">
        <Button onClick={() => toggleNewTaskModal(true)}>
          <HStack>
            <i className="fa-solid fa-plus"></i>
            <p>New task</p>
          </HStack>
        </Button>
        <Button onClick={() => navigate("/bots/wallets")}>
          <HStack>
            <i className="fa-solid fa-wallet"></i>
            <p>Wallets</p>
          </HStack>
        </Button>
      </div>
    </div>
  );
};
