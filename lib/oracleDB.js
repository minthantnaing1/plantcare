require("dotenv").config();
const oracledb = require("oracledb");

// Enable Thick Mode
oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR || "C:\\oracle\\instantclient_21_17" });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

async function connectToDB() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("✅ Successfully connected to OracleDB");
    return connection;
  } catch (err) {
    console.error("❌ OracleDB Connection Error:", err);
    throw err;
  }
}

module.exports = connectToDB;
