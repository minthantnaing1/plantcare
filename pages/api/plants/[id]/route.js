import connectToDB from "../../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id } = req.query;
  const plantId = Number(id);
  if (isNaN(plantId)) {
    return res.status(400).json({ error: "Invalid plant ID" });
  }
  let connection;
  try {
    connection = await connectToDB();
    const result = await connection.execute(
      `SELECT Plant_ID, Plant_Name, Species, Watering_Frequency, Fertilizing_Frequency, LeafCleaning_Frequency, Description 
       FROM Plant 
       WHERE Plant_ID = :id`,
      { id: plantId }
    );
    await connection.close();
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const row = result.rows[0];
    const plant = {
      PLANT_ID: row[0],
      PLANT_NAME: row[1],
      SPECIES: row[2],
      WATERING_FREQUENCY: row[3],
      FERTILIZING_FREQUENCY: row[4],
      LEAFCLEANING_FREQUENCY: row[5],
      DESCRIPTION: row[6]
    };
    return res.status(200).json(plant);
  } catch (error) {
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
