import React from "react";
import { LoadingSpinner } from "@Components";
import { useGetData } from "./useGetData";
import { Table } from "./Table";
import { notFound } from "@Assets";

import "./style.scss";

export const RealizedGains = React.memo(({ address }) => {
  const { data, isLoading } = useGetData(address);
  const rows = (data || {})?.collections || [];

  return (
    <div className="realized-gains">
      <h3>Realized gains</h3>
      {(isLoading && <LoadingSpinner />) || (
        <>
          {(rows.length && <Table rows={rows} />) || (
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
