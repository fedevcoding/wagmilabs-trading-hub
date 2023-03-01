export const errorHas = (error, string) => String(error).toLowerCase().includes(string);

export const checkErrors = error => {
  if (errorHas(error, "insufficient")) {
    return "Wallet balance is insufficient to complete this transaction";
  } else if (errorHas(error, "rejected")) {
    return "Transaction rejected";
  } else if (errorHas(error, "too many reloads")) {
    return "Too many reloads, try again later";
  } else {
    return "Something went wrong";
  }
};
