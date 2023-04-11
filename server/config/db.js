const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Client } = require("pg");

const postgres_uri = process.env.POSTGRES_URI;

const client = new Client({
  connectionString: postgres_uri,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("connected to postgres");

    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { connectDB, client };
