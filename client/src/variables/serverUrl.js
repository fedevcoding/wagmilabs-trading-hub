const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:5001" : "https://wagmiapi.wagmilabs.tools";

module.exports = serverUrl;
