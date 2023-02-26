import { useState, useEffect } from "react";

export const useManageData = () => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("wallets"));
        setWallets(data);
    }, []);

    const toggleWallet = (wallet, add) => {

        if(add){
            const data = JSON.parse(localStorage.getItem("wallets")) || [];
            data.push(wallet);
            localStorage.setItem("wallets", JSON.stringify(data));
            setWallets(data);
        }
        else if(!add) {
            const {id} = wallet;
            
            const data = JSON.parse(localStorage.getItem("wallets")) || [];
            const newData = data.filter((wallet) => wallet.id !== id);
            localStorage.setItem("wallets", JSON.stringify(newData));
            setWallets(newData);
        }
    };

    const remove = () => {
        setWallets([])
    }

    return {wallets, toggleWallet, remove};
}