import { useEffect, useState } from "react";

export const useGetWallets = () => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const wallets = JSON.parse(localStorage.getItem("wallets")) || [];
    if (wallets) {
      setWallets(wallets);
    }
  }, []);

  return wallets;
};
