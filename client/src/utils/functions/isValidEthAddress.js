export function isValidEthAddress(address) {
  const pattern = /^0x[a-fA-F0-9]{40}$/;
  return pattern.test(address);
}
