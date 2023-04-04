const burnerAddresses = [
  "0x0000000000000000000000000000000000000000",
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "0x000000000000000000000000000000000000dEaD",
  "0x0000000000000000000000000000000000000001",
];

const SQL_BURNER_ADDRESS = burnerAddresses.map(address => `'${address}'`).join(",");

module.exports = { burnerAddresses, SQL_BURNER_ADDRESS };
