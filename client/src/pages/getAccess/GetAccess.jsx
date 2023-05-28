import React, { useState } from "react";
import "./style.scss";
import { Button } from "@chakra-ui/react";
import { useSubscribe } from "../../custom-hooks/useSubscribe";
import { Loader } from "../../components/Loader";

const GetAccess = () => {
  const [loading, setLoading] = useState(false);
  const { subscribe } = useSubscribe();

  const subscribePro = async () => {
    setLoading(true);
    await subscribe(2, 1, 0.03);
    setLoading(false);
  };

  return (
    <div id="get-access-page">
      <div className="container">
        <h1>
          This page is available only with <span className="premium">Premium</span>
        </h1>
        <Button colorScheme="blue" height={"70px"} width={"250px"} onClick={subscribePro}>
          {loading ? <Loader width={"30px"} height={"30px"} /> : <p> Get 1 month (Ξ0.03)</p>}
        </Button>
      </div>
    </div>
  );
};

export default GetAccess;
