import * as jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import logOut from "../utils/functions/logout";
import { UserDataContext } from "../context/userContext";

export const useJwtData = () => {
  const { setConnected } = useContext(UserDataContext);

  const [isFree, setIsFree] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isPartnership, setIsPartnership] = useState(false);
  const [loadedJwtData, setLoaded] = useState(false);
  const [expiration, setExpiration] = useState(0);

  useEffect(() => {
    const setData = async () => {
      const jsonwebtoken = localStorage.getItem("jsonwebtoken");

      if (jsonwebtoken) {
        // 0 = pass, 1 = basic subscription, 2 = pro subscription, 3 = free trial, 4 = allowed/partnership, 5 = free access, 6 = email pro

        const decoded = await jwt_decode(jsonwebtoken);
        const { passType, expiration } = decoded;
        const expirationNumber = Number(expiration);
        setExpiration(expirationNumber);

        if (expirationNumber < Date.now()) {
          await logOut(setConnected);
        }

        if (passType === 4 || passType === 6) {
          setIsPartnership(true);
          setIsPro(true);
        }
        if (passType === 5) setIsFree(true);
        if (passType === 2 || passType === 0) setIsPro(true);

        setLoaded(true);
      }
    };
    setData();
  }, [setConnected]);

  return { isPro, isFree, expiration, loadedJwtData, isPartnership };
};
