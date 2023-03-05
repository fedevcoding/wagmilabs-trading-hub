import { useProvider } from "./useProvider";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

const abiFunction = [
  {
    name: "multiSendEther",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address[100]", name: "addresses" },
      { type: "uint256[100]", name: "amounts" },
    ],
    constant: false,
    payable: true,
    type: "function",
  },
];

const contractAddress = "0x941F40C2955EE09ba638409F67ef27C531fc055C";

let lastReloadDate = undefined;

export const useWeb3Utils = () => {
  const { data: signer } = useSigner();

  const { web3 } = useProvider();

  async function getBalances(wallets) {
    // reload only once every 20 seconds
    if (lastReloadDate && Date.now() - lastReloadDate < 20000) {
      throw new Error("Too many reloads");
    }
    lastReloadDate = Date.now();
    const balancePromises = wallets.map(async wallet => {
      const balance = await web3.eth.getBalance(wallet?.address || wallet);
      return web3.utils.fromWei(balance, "ether");
    });

    const balances = await Promise.all(balancePromises);
    return balances;
  }

  const getAddressAndBalance = async privateKey => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const address = account.address;
    const balance = (await web3.eth.getBalance(address)) / 10 ** 18;
    return { address, balance };
  };

  const getAddressFromPrivateKey = privateKey => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const address = account.address;
    return address;
  };

  const generateWallets = async (amount, name, date) => {
    try {
      const wallets = [];
      for (let i = 0; i < amount; i++) {
        const wallet = ethers.Wallet.createRandom();
        const { address, privateKey } = wallet;
        const id = crypto.randomUUID();
        const newName = `${name} ${i + 1}`;
        wallets.push({ type: "generate", name: newName, date, balance: 0, privateKey, id, address });
      }
      return wallets;
    } catch (e) {
      throw new Error(e);
    }
  };

  const batchTransferEth = async (value, toArray, valueArray) => {
    try {
      const contract = new ethers.Contract(contractAddress, abiFunction, signer);
      const totalValue = ethers.utils.parseEther(value);
      const tx = await contract.multiSendEther(toArray, valueArray, { value: totalValue });
      await tx.wait(1);
    } catch (e) {
      throw new Error(e);
    }
  };

  return { getAddressAndBalance, generateWallets, batchTransferEth, getBalances, getAddressFromPrivateKey };
};
