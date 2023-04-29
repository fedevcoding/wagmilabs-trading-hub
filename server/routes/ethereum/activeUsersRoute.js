const express = require("express");
const { allowedAddresses } = require("../../config/allowedAddresses");
const { getUsers } = require("../../socketio/socket");
const activeUsersRoute = express();
require("dotenv").config();

activeUsersRoute.get("/activeUsers", (req, res) => {
  const password = process.env.DATA_ACCESS_PASSWORD;
  const { accessPassword } = req.query;

  if (password !== accessPassword) {
    return res.status(401).send("Unauthorized");
  }

  const users = getUsers();

  const partnershipUsers = allowedAddresses.filter(address => address.expiration > Date.now()).length;
  res.json({ users, partnershipUsers });
});

module.exports = activeUsersRoute;
