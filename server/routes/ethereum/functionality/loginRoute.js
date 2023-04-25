const express = require("express");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const checkOwnership = require("../../../middleware/checkOwnership.js");
const User = require("../../../models/userModel.js");
const Stats = require("../../../models/StatsModel.js");
// const fallbackPfp = require("../../../images/userPfp.png");
const { isTeam } = require("../../../config/allowedAddresses.js");
const { client } = require("../../../config/db.js");

const loginRoute = express();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY;
const REFRESH_JWT_DAYS = 1;
const ACCESS_JWT_SECONDS = 200;

loginRoute.post("/", checkOwnership, async (req, res) => {
  try {
    const { passType, expiration, address } = req?.ownershipData || {};
    const { source } = req?.body || "";

    if (!address) {
      res.status(403).json({ authenticated: false, message: "Missing query fields." });
    } else {
      const partOfTeam = isTeam(address);
      if (!partOfTeam) {
        const ip = req.clientIp;
        const timestamp = Date.now();
        await client.query(
          "INSERT INTO stats (type, timestamp, source, address, ip_address) VALUES ($1, $2, $3, $4, $5)",
          ["login", timestamp, source, address, ip]
        );
      }
      const accessToken = JWT.sign(
        {
          address,
          passType,
          expiration,
        },
        JWT_PRIVATE_KEY,
        {
          expiresIn: ACCESS_JWT_SECONDS,
        }
      );

      const refreshToken = JWT.sign(
        {
          address,
          passType,
          expiration,
        },
        JWT_REFRESH_PRIVATE_KEY,
        {
          expiresIn: 86400 * REFRESH_JWT_DAYS,
        }
      );

      const user = await User.findOne({ address });

      if (user) {
        user.passType = passType;
        await user.save();

        res
          .status(200)
          .cookie("refreshJWT", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 86400000 * REFRESH_JWT_DAYS,
          })
          .json({
            message: "User authenticated",
            token: accessToken,
            refreshToken,
            authenticated: true,
          });
      } else {
        const profileImage = await getProfileImage(address);

        User.create({
          address,
          profileImage,
          passType,
          listSettings: {
            price: {
              type: "break-even",
              profitType: "usd",
              profitValue: "100",
            },
            time: {
              months: 0,
              days: 1,
              hours: 0,
              minutes: 0,
            },
            marketplace: "opensea",
          },
          shoppingCart: [],
          gasSettings: {
            label: "Fast",
            value: "fast",
            maxPriorityFeePerGas: 1.5,
            custom: {
              maxPriorityFeePerGas: 0,
              maxFeePerGas: 0,
            },
          },
        });
        res
          .status(200)
          .cookie("refreshJWT", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({
            message: "User authenticated",
            token: accessToken,
            refreshToken,
            authenticated: true,
          });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      authenticated: false,
      message: "Something went wrong while trying to login.",
    });
  }
});
module.exports = loginRoute;

async function getProfileImage(address) {
  try {
    pfp = await fetch(`https://api.opensea.io/api/v1/account/${address}`);
    pfp = await pfp.json();
    pfp = pfp?.data?.profile_img_url || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

    return pfp;
  } catch (err) {
    console.error(err);
  }
}
