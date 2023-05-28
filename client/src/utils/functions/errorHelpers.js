export const errorHas = (error, string) => {
  if (typeof error === "object") {
    error = JSON.stringify(error?.response?.data || error?.response || error);
  }
  return String(error?.toLowerCase()).toLowerCase().includes(string);
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
  } else if (errorHas(error, "expirationtime")) {
    return "Invalid expiration time";
  } else if (errorHas(error, "insufficient funds")) {
    return "Insufficient funds";
  } else if (errorHas(error, "have a free trial")) {
    return "Free trial already active/used";
  } else if (errorHas(error, "insufficient transactions")) {
    return "You need to have at least 25 transactions to start a free trial";
  } else if (errorHas(error, "already subscribed")) {
    return "You are already subscribed to this plan";
  } else if (errorHas(error, "mails_address_key")) {
    return "Already claimed free pro";
  } else if (errorHas(error, "mails_email_key")) {
    return "Email already in use";
  } else {
    return "Something went wrong";
  }
};
