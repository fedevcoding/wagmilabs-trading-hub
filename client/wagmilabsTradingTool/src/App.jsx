// react
import React, { useState, useEffect, useRef, useMemo } from "react";
import { jwtExpired, pushToServer } from "./utils/functions";

// components
import Header from "./pages/header/Header";
import Home from "./pages/home/Home";
import Collection from "./pages/collection/Collection";
import Volumes from "./pages/volumes/Volumes";
import Feed from "./pages/feed/Feed";
// import Pnl from "./pages/pnl/Pnl";
import Login from "./pages/login/LoginRainbow";
import Profile from "./pages/profile/Profile";
import Item from "./pages/item/Item";
import Checking from "./pages/checking/Checking";
import CheckWalletDisconnect from "./pages/CheckWalletDisconnect";
import Footer from "./pages/footer/Footer";

// libraries

// chakra
import { ChakraProvider } from "@chakra-ui/react";

// wagmi / rainbowkit
import { ReservoirKitProvider, darkTheme as reservoirDarkTheme } from "@reservoir0x/reservoir-kit-ui";
import { chain, configureChains, WagmiConfig, createClient as createWagmiClient } from "wagmi";
import { createClient } from "@reservoir0x/reservoir-kit-client";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { SIGNER_PRIVATE_KEY, RESERVOIR_API_KEY } from "@Variables";

// react router
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SniperBot from "./pages/bots/sniper/SniperBot";
import Wallets from "./pages/bots/wallets/Wallets";

// socket io
import io from "socket.io-client";

// context

import { UserDataContext, SocketContext, ConnectedContext } from "@Context";
import Redirect from "./pages/redirect/Redirect";

import Legals from "./pages/Legal/Legals";
import { serverUrl } from "@Variables";
import Pnl from "./pages/pnl/Pnl";
import { Calendar } from "./pages/calendar/Calendar";

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
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);
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

  // set checking in base of tokens
  useEffect(() => {
    async function view() {
      try {
        await pushToServer("/stats", { type: "view", timestamp: Date.now() });
      } catch (e) {
        console.log(e);
      }
    }
    view();

    async function verify() {
      const { pathname } = window.location;
      const { jsonwebtoken } = localStorage;

      if (pathname === "/legal") {
        setChecking(false);
        setLoading(false);
      } else {
        if (jsonwebtoken && pathname !== "/") {
          const valid = await jwtExpired(jsonwebtoken);
          if (valid) setConnected(true);
          else setChecking(true);
        } else if (jsonwebtoken) {
          setChecking(true);
        } else {
          if (pathname !== "/") window.location.href = "/";
          setConnected(false);
        }
        setLoading(false);
      }
    }
    verify();
  }, []);

  // set colors based on states
  useEffect(() => {
    if (!connected) {
      document.body.style.background = "#0e0f0e";
    } else {
      document.body.style.background = "#0E0F0E";
    }
  }, [connected, checking]);

  // socket io connection
  useEffect(() => {
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

  useEffect(() => {
    gasSettings.value && socket.emit("getEthData");
  }, [gasSettings.value]);

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
      ethData,
      connected,
      setConnected,
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
      ethData,
    ]
  );

  const connectedContextValues = useMemo(
    () => ({
      connected,
      setConnected,
    }),
    [connected, setConnected]
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
              <RainbowKitProvider chains={chains} coolMode theme={darkTheme({ overlayBlur: "small" })}>
                {!loading &&
                  (checking ? (
                    <Checking setConnected={setConnected} setChecking={setChecking} />
                  ) : !connected ? (
                    <>
                      <BrowserRouter>
                        <Routes>
                          <Route exact path="/" element={<Login setConnected={setConnected} connected={connected} />} />
                          <Route exact path="/legal" element={<Legals />} />
                        </Routes>
                      </BrowserRouter>
                    </>
                  ) : (
                    <>
                      <CheckWalletDisconnect />
                      <ConnectedContext.Provider value={connectedContextValues}>
                        <div className={`${"not-responsive"}`}>
                          <p>This application is not optimized for small screens yet.</p>
                        </div>
                        <div id="application-wrapper">
                          <BrowserRouter>
                            <Routes>
                              <Route
                                exact
                                path="/"
                                element={
                                  connected && (
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
                                path="/bots/wallets"
                                element={
                                  <>
                                    <Header />
                                    <Wallets />
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
                                path="/calendars/:section"
                                element={
                                  <>
                                    <Header />
                                    <Calendar />
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
                                path="/profile/:address"
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
                        </div>
                      </ConnectedContext.Provider>
                    </>
                  ))}
              </RainbowKitProvider>
            </WagmiConfig>
          </ReservoirKitProvider>
        </UserDataContext.Provider>
      </SocketContext.Provider>
    </ChakraProvider>
  );
}

export default App;
