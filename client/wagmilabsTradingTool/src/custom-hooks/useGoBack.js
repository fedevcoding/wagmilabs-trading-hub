import { useNavigate } from "react-router-dom";

export const useGoBack = () => {
  const navigate = useNavigate();
  const goBack = amunt => {
    navigate(-amunt);
  };
  return goBack;
};
