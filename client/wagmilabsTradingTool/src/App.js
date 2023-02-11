// react
import { useState, useEffect, useRef, useMemo } from "react";

// components
import Header from "./pages/header/Header";
import Home from "./pages/home/Home";
import Collection from "./pages/collection/Collection";
import Calculators from "./pages/calculators/Calculators";
import Volumes from "./pages/volumes/Volumes";
import Feed from "./pages/feed/Feed";
import Pnl from "./pages/pnl/Pnl";
import Login from "./pages/login/LoginRainbow";
import Profile from "./pages/profile/Profile";
import Item from "./pages/item/Item";
import Checking from "./pages/checking/Checking";
import CheckingHeader from "./pages/header/CheckingHeader";
import CheckWalletDisconnect from "./pages/CheckWalletDisconnect";
import Footer from "./pages/footer/Footer";

// libraries

// chakra
import { ChakraProvider } from "@chakra-ui/react";

// wagmi / rainbowkit
import {
  ReservoirKitProvider,
  darkTheme as reservoirDarkTheme,
} from "@reservoir0x/reservoir-kit-ui";
import {
  chain,
  configureChains,
  WagmiConfig,
  createClient as createWagmiClient,
} from "wagmi";
import { createClient } from "@reservoir0x/reservoir-kit-client";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { SIGNER_PRIVATE_KEY, RESERVOIR_API_KEY } from "./variables/rpcNodes";

// react router
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SniperBot from "./pages/bots/sniper/SniperBot";

// socket io
import io from "socket.io-client";

// context

import { UserDataContext } from "./context/userContext";
import { SocketContext } from "./context/SocketContext";
import Redirect from "./pages/redirect/Redirect";
import Legals from "./pages/Legal/Legals";
import serverUrl from "./variables/serverUrl";

// for wagmi

const { chains, provider } = configureChains(
  [chain.mainnet],
  [infuraProvider({ apiKey: SIGNER_PRIVATE_KEY }), publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Wagmi labs trading tool",
  chains,
});
const wagmiClient = createWagmiClient({
  autoConnect: true,
  connectors,
  provider,
});
createClient({
  apiBase: "https://api.reservoir.tools",
  apiKey: RESERVOIR_API_KEY,
  source: "http://localhost:3000",
});

// for reservoir
const theme = reservoirDarkTheme({
  headlineFont: "Sans Serif",
  font: "Serif",
  primaryColor: "transparent",
  primaryHoverColor: "transparent",
});

// for socket io
const socket = io(serverUrl);

function App() {
  // states
  const [userBalances, setUserBalances] = useState({
    eth: 0,
    weth: 0,
    usdc: 0,
    usdt: 0,
  });
  const [snipingTasks, setSnipingTasks] = useState([]);
  const [connected, setConnected] = useState(false);
  const [ethData, setEthData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [checking, setChecking] = useState(false);
  const [userCartItems, setUserCartItems] = useState([]);
  const [listingSettings, setListingSettings] = useState({});
  const [gasSettings, setGasSettings] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({
    eth: 0,
    usdc: 0,
    usdt: 0,
  });
  const [ens, setEns] = useState("");
  const activeGasRef = useRef(gasSettings.value);
  const currentSnipingTasks = useRef(snipingTasks);

  // set tasks ref when they change
  useEffect(() => {
    currentSnipingTasks.current = snipingTasks;
  }, [snipingTasks]);

  // set checking in base of tokens
  useEffect(() => {
    if (localStorage.jsonwebtoken) {
      setChecking(true);
    }
  }, []);

  // set colors based on states
  useEffect(() => {
    if (checking) {
      document.body.style.background = "black";
    } else if (!connected) {
      document.body.style.background =
        "linear-gradient(to right, #3494E6, #EC6EAD)";
    } else {
      document.body.style.background = "#0E0F0E";
    }
  }, [connected, checking]);

  // socket io connection
  useEffect(() => {
    socket.on("connect", () => console.log("socket.io connected")); // only 1 connection established
    socket.on("ethData", data => {
      const { gasMapping, currencyPrices } = data;
      switch (activeGasRef.current) {
        case "custom":
          break;
        case "instant":
          setGasSettings(prev => ({
            ...prev,
            maxFeePerGas: gasMapping["instantGas"].maxFeePerGas,
          }));
          break;
        case "fast":
          setGasSettings(prev => ({
            ...prev,
            maxFeePerGas: gasMapping["fastGas"].maxFeePerGas,
          }));
          break;
        case "standard":
          setGasSettings(prev => ({
            ...prev,
            maxFeePerGas: gasMapping["standardGas"].maxFeePerGas,
          }));
          break;
        default:
          break;
      }

      setCryptoPrices(currencyPrices);
      setEthData(data);
    });

    return () => socket.off("disconnect");
  }, []);

  // set gas setting ref when it changes
  useEffect(() => {
    if (gasSettings.value) {
      activeGasRef.current = gasSettings.value;
    }
  }, [gasSettings]);

  // context values
  const providerValues = useMemo(
    () => ({
      ens,
      setEns,
      cryptoPrices,
      userCartItems,
      setUserCartItems,
      profileImage,
      setProfileImage,
      listingSettings,
      setListingSettings,
      gasSettings,
      setGasSettings,
      userBalances,
      setUserBalances,
      snipingTasks,
      setSnipingTasks,
      ethData,
      connected,
      setConnected,
      currentSnipingTasks,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      ens,
      setEns,
      cryptoPrices,
      userCartItems,
      setUserCartItems,
      profileImage,
      setProfileImage,
      listingSettings,
      setListingSettings,
      gasSettings,
      setGasSettings,
      userBalances,
      setUserBalances,
      snipingTasks,
      setSnipingTasks,
      ethData,
      currentSnipingTasks,
    ]
  );

  return (
    <ChakraProvider resetCSS={false}>
      <SocketContext.Provider value={socket}>
        <UserDataContext.Provider value={providerValues}>
          <ReservoirKitProvider
            options={{
              apiBase: "https://api.reservoir.tools",
              apiKey: RESERVOIR_API_KEY,
            }}
            theme={theme}
          >
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider
                chains={chains}
                coolMode
                theme={darkTheme({ overlayBlur: "small" })}
              >
                {connected && <CheckWalletDisconnect />}
                <BrowserRouter>
                  <Routes>
                    <Route
                      exact
                      path="/"
                      element={
                        connected ? (
                          <>
                            <Header
                              setConnected={setConnected}
                              profileImage={profileImage}
                              setProfileImage={setProfileImage}
                              connected={connected}
                            />
                            <Home />
                            <Footer />
                          </>
                        ) : checking ? (
                          <>
                            <CheckingHeader />
                            <Checking
                              setConnected={setConnected}
                              setChecking={setChecking}
                            />
                          </>
                        ) : (
                          <Login
                            setConnected={setConnected}
                            connected={connected}
                          />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/collection/:address"
                      element={
                        <>
                          <Header /> <Collection /> <Footer />{" "}
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/item/:address/:id"
                      element={
                        <>
                          <Header />
                          <Item />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/bots/sniper"
                      element={
                        <>
                          <Header />
                          <SniperBot />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/calculators"
                      element={
                        <>
                          <Header />
                          <Calculators />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/volumes"
                      element={
                        <>
                          <Header />
                          <Volumes />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/feed"
                      element={
                        <>
                          <Header />
                          <Feed />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/profitandloss"
                      element={
                        <>
                          <Header />
                          <Pnl />
                          <Footer />
                        </>
                      }
                    />

                    <Route
                      exact
                      path="/profile"
                      element={
                        <>
                          <Header />
                          <Profile />
                          <Footer />
                        </>
                      }
                    />

                    <Route exact path="/legal" element={<Legals />} />

                    <Route path="*" element={<Redirect />} />
                  </Routes>
                </BrowserRouter>
              </RainbowKitProvider>
            </WagmiConfig>
          </ReservoirKitProvider>
        </UserDataContext.Provider>
      </SocketContext.Provider>
    </ChakraProvider>
  );
}

export default App;
