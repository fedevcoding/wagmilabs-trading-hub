// const express = require("express");
// const { client } = require("../../config/db");
// const crypto = require("crypto");
// const addEmailRoute = express();

// addEmailRoute.post("/", async (req, res) => {
//   try {
//     const { address, email } = req.body;
//     const ip = req.clientIp;

//     if (!address || !email) {
//       return res.status(400).json({ message: "Invalid request." });
//     }
//     await client.query(
//       `INSERT INTO mails (id, address, email, ip_address, timestamp) VALUES ('${crypto.randomUUID()}', '${address}', '${email}', '${ip}', ${Date.now()})`
//     );

//     return res.status(200).json({ message: "Email added." });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// });

// module.exports = addEmailRoute;
