import { useState, useEffect } from "react";
import { useWeb3Utils } from "@Hooks";
import { useToast } from "@chakra-ui/react";
import { checkErrors } from "@Utils";

export const useManageData = () => {
  const [wallets, setWallets] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const { getBalances } = useWeb3Utils();

  const toast = useToast();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wallets"));
    setWallets(data);
  }, []);

  async function reloadBalances() {
    try {
      setLoadingBalances(true);
      const balances = await getBalances(wallets);

      const newWallets = wallets.map((wallet, index) => {
        return { ...wallet, balance: balances[index] };
      });
      setWallets(newWallets);
      localStorage.setItem("wallets", JSON.stringify(newWallets));

      toast({
        title: "Success",
        description: "Balances updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      const errorMessage = checkErrors(e);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingBalances(false);
    }
  }

  const renameWallet = (id, newName) => {
    const newData = wallets.map(wallet => {
      if (wallet.id === id) {
        return { ...wallet, name: newName };
      }
      return wallet;
    });
    localStorage.setItem("wallets", JSON.stringify(newData));
    setWallets(newData);
  };

  const toggleWallet = (wallet, add) => {
    // 0 = already exists
    // 1 = added
    // -1 = removed
    // 2 = duplicate name
    // 4 = too many wallets
    const data = JSON.parse(localStorage.getItem("wallets")) || [];

    if (data.find(w => w.name === wallet.name)) return 2;

    if (add) {
      if (data.length >= 50) return 4;

      if (data.find(w => w.address === wallet.address)) return 0;

      data.push(wallet);
      localStorage.setItem("wallets", JSON.stringify(data));

      setWallets(data);
      return 1;
    } else if (!add) {
      const { id } = wallet;
      const newData = data.filter(wallet => wallet.id !== id);
      localStorage.setItem("wallets", JSON.stringify(newData));
      setWallets(newData);

      return -1;
    }
  };

  return { wallets, toggleWallet, reloadBalances, loadingBalances, renameWallet };
};
