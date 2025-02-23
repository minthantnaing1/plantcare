require("dotenv").config();
const oracledb = require("oracledb");

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

console.log("Testing OracleDB connection...");
console.log("ORACLE_CONNECTION_STRING:", dbConfig.connectString);

async function testConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("✅ Successfully connected to OracleDB");
    
    const result = await connection.execute(`SELECT 'Connection Successful' AS status FROM dual`);
    console.log(result.rows);

    await connection.close();
  } catch (error) {
    console.error("❌ Connection Failed:", error);
  }
}

testConnection();
