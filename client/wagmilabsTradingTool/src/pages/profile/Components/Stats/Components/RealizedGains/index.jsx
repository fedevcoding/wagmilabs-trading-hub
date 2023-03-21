import React from "react";
import { LoadingSpinner } from "@Components";
import { useGetData } from "./useGetData";
import { useCollections } from "@reservoir0x/reservoir-kit-ui";
import { Table } from "./Table";
import { notFound } from "@Assets";

import "./style.scss";

export const RealizedGains = React.memo(({ address }) => {
  const { data, isLoading } = useGetData(address);

  const collections = useCollections(
    (data || {})?.collections
      ? {
          contract: data.collections.map(c => c.address).slice(0, 20),
        }
      : false
  )?.data?.reduce((acc, key) => {
    acc[key.primaryContract.toLowerCase()] = {
      img: key.image,
      name: key.name,
    };
    return acc;
  }, {});

  const rows = (data || {})?.collections || [];

  return (
    <div className="realized-gains">
      <h3>Realized gains</h3>
      {(isLoading && <LoadingSpinner />) || (
        <>
          {(rows.length && <Table rows={rows} collections={collections} />) || (
            <div className="no-elements">
              <img src={notFound} alt="not-found" width={150} />
              <p>No trades made</p>
            </div>
          )}
        </>
      )}
    </div>
  );
});
