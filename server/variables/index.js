const { IS_DEV } = require("../utils/utils");

const CLIENT_URL = IS_DEV ? "http://localhost:3000" : "https://app.wagmilabs.tools";
const RESERVOIR_SOURCE = "app.wagmilabs.tools";
const WAGMI_URL = "https://wagmilabs.tools";
module.exports = { CLIENT_URL, RESERVOIR_SOURCE, WAGMI_URL };
