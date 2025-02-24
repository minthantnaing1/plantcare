import connectToDB from "../../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query; // dynamic parameter from URL
  const plantId = Number(id);

  if (isNaN(plantId)) {
    return res.status(400).json({ error: "Invalid plant ID" });
  }

  let connection;
  try {
    connection = await connectToDB();

    // Fetch plant details using named parameter binding
    const plantResult = await connection.execute(
      "SELECT PLANT_ID, NAME, SPECIES FROM PLANT WHERE PLANT_ID = :id",
      { id: plantId }
    );

    if (!plantResult.rows || plantResult.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }

    // Fetch associated reminders
    const reminderResult = await connection.execute(
      "SELECT TASK_NAME, DESCRIPTION, FREQUENCY FROM REMINDER WHERE PLANT_ID = :id",
      { id: plantId }
    );

    const plantRow = plantResult.rows[0];
    const plant = {
      PLANT_ID: plantRow[0],
      NAME: plantRow[1],
      SPECIES: plantRow[2],
      REMINDERS: (reminderResult.rows || []).map(row => ({
        TASK_NAME: row[0],
        DESCRIPTION: row[1],
        FREQUENCY: row[2]
      }))
    };

    return res.status(200).json(plant);
    
  } catch (error) {
    return res.status(500).json({
      error: "Database connection failed",
      details: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Failed to close connection:", err);
      }
    }
  }
}
