import { useState, useEffect } from "react";

export const useManageData = () => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("wallets"));
        setWallets(data);
    }, []);

    const toggleWallet = (wallet, add) => {
        // 0 = already exists
        // 1 = added
        // -1 = removed
        // 2 = duplicate name
        // 4 = too many wallets
        const data = JSON.parse(localStorage.getItem("wallets")) || [];


        if(data.find((w) => w.name === wallet.name)) return 2;

        if(add){

            if(data.length >= 50) return 4;

            if(data.find((w) => w.address === wallet.address)) return 0;

            data.push(wallet);
            localStorage.setItem("wallets", JSON.stringify(data));

            setWallets(data);
            return 1;
        }
        else if(!add) {
            const {id} = wallet;
            const newData = data.filter((wallet) => wallet.id !== id);
            localStorage.setItem("wallets", JSON.stringify(newData));
            setWallets(newData);

            return -1;
        }
    };

    return {wallets, toggleWallet};
}