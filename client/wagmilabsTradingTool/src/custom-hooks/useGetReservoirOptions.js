import React from "react";
import { UserDataContext } from "@Context";

export const useGetReservoirOptions = () => {
  const { gasSettings } = React.useContext(UserDataContext);

  const maxFeePerGas = Math.round((gasSettings.maxFeePerGas * 1000000000)).toString();
  const maxPriorityFeePerGas = Math.round((
    gasSettings.maxPriorityFeePerGas * 1000000000
  )).toString();

  return {
    options: {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  };
};
