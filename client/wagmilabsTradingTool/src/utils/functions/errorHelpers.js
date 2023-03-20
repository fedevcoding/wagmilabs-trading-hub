export const errorHas = (error, string) => {
  if (typeof error === "object") {
    error = JSON.stringify(error?.response?.data || error?.response || error);
  }
  return String(error).toLowerCase().includes(string);
};

export const checkErrors = error => {
  if (errorHas(error, "balance too low")) {
    return "Wallet balance is insufficient to complete this transaction";
  } else if (errorHas(error, "rejected")) {
    return "Transaction rejected";
  } else if (errorHas(error, "too many reloads")) {
    return "Too many reloads, try again later";
  } else if (errorHas(error, "not fillable")) {
    return "One or more orders not available";
  } else {
    return "Something went wrong";
  }
};
