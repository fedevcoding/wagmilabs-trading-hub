import React from "react";
import "./style.scss";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useJwtData } from "../../custom-hooks/useJwtData";

const PremiumLock = ({ children, callBack = () => {} }) => {
  const { isPro } = useJwtData();
  const navigate = useNavigate();

  const goToPlans = () => {
    callBack();
    navigate("/plans");
  };

  return (
    <>
      {!isPro && (
        <Button colorScheme="blue" className="premium-lock" onClick={goToPlans}>
          <i className="fa-solid fa-lock"></i>
          {children}
        </Button>
      )}
    </>
  );
};

export default PremiumLock;
