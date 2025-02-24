import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  try {
    const connection = await connectToDB();

    // Fetch plants from OracleDB
    const result = await connection.execute(
      "SELECT PLANT_ID, NAME, SPECIES FROM PLANT"
    );

    await connection.close();

    // Convert array format to object format
    const formattedData = result.rows.map(row => ({
      PLANT_ID: row[0],
      NAME: row[1],
      SPECIES: row[2]
    }));

    console.log("Formatted API response:", formattedData);
    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
}
