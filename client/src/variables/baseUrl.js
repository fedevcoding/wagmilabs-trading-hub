const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:5001/api/v1/wagmilabs" : "https://wagmiapi.wagmilabs.tools/api/v1/wagmilabs";
module.exports = baseUrl;
