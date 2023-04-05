import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";

export const useJwtData = () => {
  const [isFree, setIsFree] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loadedJwtData, setLoaded] = useState(false);
  const [expiration, setExpiration] = useState(0);

  useEffect(() => {
    const setData = async () => {
      const jsonwebtoken = localStorage.getItem("jsonwebtoken");

      if (jsonwebtoken) {
        // 0 = pass, 1 = basic subscription, 2 = pro subscription, 3 = free trial, 4 = allowed/partnership
        const decoded = await jwt_decode(jsonwebtoken);
        const { passType, expiration } = decoded;

        const expirationNumber = Number(expiration);
        setExpiration(expirationNumber);
        if (passType === 3) setIsFree(true);
        if (passType === 2 || passType === 0 || passType === 4) setIsPro(true);

        setLoaded(true);
      }
    };
    setData();
  }, []);

  return { isPro, isFree, expiration, loadedJwtData };
};
