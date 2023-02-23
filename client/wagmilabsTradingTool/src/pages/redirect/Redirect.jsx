import React from "react";
import { notFound } from "@Assets";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSetPageTitle } from "@Hooks";

import "./style.scss";

const Redirect = () => {
  useSetPageTitle("404 Not foun | Wagmi Labs");
  const navigate = useNavigate();

  return (
    <div className="page-not-found-container">
      <p>404: The page you are looking for could not be found</p>
      <img src={notFound} alt="" />
      <Button onClick={() => navigate("/")}>Take me home</Button>
    </div>
  );
};

export default Redirect;
