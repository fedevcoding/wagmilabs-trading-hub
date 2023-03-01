import { HStack, Tooltip } from "@chakra-ui/react";
import { PageWrapper } from "@Components";
import React, { useMemo } from "react";

import "./style.scss";
import { useManageData, useManageModals } from "./hooks";
import { AddModal, ExportModal, TransferModal } from "./modals";
import { formatAddress, roundPrice } from "src/utils/formats/formats";
import copy from "copy-to-clipboard";
import { notFound } from "src/assets";

const Wallets = React.memo(() => {
  const { showAddModal, showExportModal, showTransferModal, toggleModal } = useManageModals();
  const { wallets, toggleWallet } = useManageData();

  const [copyState, setCopyState] = React.useState("Copy");

  const copyAddress = address => {
    copy(address);
    setCopyState("Copied");
    setTimeout(() => {
      setCopyState("Copy");
    }, 400);
  };

  return (
    <PageWrapper page="bots-wallets">
      <div className="modals">
        <AddModal showAddModal={showAddModal} toggleModal={toggleModal} toggleWallet={toggleWallet} />
        <TransferModal showTransferModal={showTransferModal} toggleModal={toggleModal} />
        <ExportModal showExportModal={showExportModal} toggleModal={toggleModal} />
      </div>

      <HStack className="options">
        <HStack className="wallet" gap={"5px"}>
          <i className="fa-solid fa-wallet"></i>
          <p>Wallets manager</p>
        </HStack>

        <HStack className="actions">
          <HStack gap="5px" onClick={() => toggleModal("transfer", true)}>
            <i className="fa-solid fa-truck"></i>
            <p>Transfer</p>
          </HStack>

          <HStack gap="5px" onClick={() => toggleModal("export", true)}>
            <i className="fa-sharp fa-solid fa-upload"></i>
            <p>Export</p>
          </HStack>

          <HStack gap="5px" onClick={() => toggleModal("add", true)}>
            <i className="fa-solid fa-plus"></i>
            <p>Add wallet</p>
          </HStack>
        </HStack>
      </HStack>

      <hr className="header-divider" />

      <div className="wallets">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Balance</th>
              <th>Added date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {useMemo(
              () =>
                !wallets?.length || wallets?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-wallets">
                      <div>
                        <img src={notFound} alt="no wallets found"></img>
                        <p>No wallets added yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  wallets?.map((wallet, index) => {
                    const key = crypto.randomUUID();
                    const { id } = wallet;
                    const isLast = index === wallets.length - 1;

                    return (
                      <React.Fragment key={key}>
                        <tr className={`${isLast && "last-tr"}`}>
                          <td>
                            <p className="name">{wallet.name}</p>
                          </td>
                          <td>
                            <Tooltip
                              label={copyState}
                              closeOnClick={false}
                              hasArrow
                              fontSize="xs"
                              bg="black"
                              color={"white"}
                              placement="top"
                              borderRadius={"7px"}
                            >
                              <p className="address" onClick={() => copyAddress(wallet.address)}>
                                {formatAddress(wallet.address)}
                              </p>
                            </Tooltip>
                          </td>

                          <td>
                            <HStack>
                              <p>{roundPrice(wallet.balance)}</p>
                              <i className="fa-brands fa-ethereum"></i>
                            </HStack>
                          </td>
                          <td>
                            <p>{wallet.date}</p>
                          </td>
                          <td>
                            <HStack gap="5px" onClick={() => toggleWallet({ id }, false)} cursor="pointer">
                              <i className="fa-solid fa-trash"></i>
                              <p>Delete</p>
                            </HStack>
                          </td>
                        </tr>

                        {!isLast && (
                          <tr>
                            <td colSpan={6}>
                              <hr className="wallet-divison" />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ),
              [wallets, copyState, toggleWallet]
            )}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
});

export default Wallets;
