import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJwtData } from "./useJwtData";

export const useSecurePro = () => {
  const { isPro, loadedJwtData } = useJwtData();
  const navigate = useNavigate();

  useEffect(() => {
    if (loadedJwtData && !isPro) {
      navigate("/notfound");
    }
  }, [isPro, navigate, loadedJwtData]);
};
