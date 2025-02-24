import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  let connection;
  try {
    connection = await connectToDB();
    if (req.method === "GET") {
      // Return all catalog plants from the Plant table.
      const result = await connection.execute(
        `SELECT Plant_ID, Plant_Name, Species, Watering_Frequency, Fertilizing_Frequency, LeafCleaning_Frequency, Description 
         FROM Plant`
      );
      await connection.close();
      const formattedData = result.rows.map(row => ({
        PLANT_ID: row[0],
        PLANT_NAME: row[1],
        SPECIES: row[2],
        WATERING_FREQUENCY: row[3],
        FERTILIZING_FREQUENCY: row[4],
        LEAFCLEANING_FREQUENCY: row[5],
        DESCRIPTION: row[6]
      }));
      return res.status(200).json(formattedData);
    } else if (req.method === "POST") {
      // Insert a new Reminder record when a user adds a plant.
      // Expected JSON body: { plant_id, user_id, task, frequency, description }
      const { plant_id, user_id, task, frequency, description } = req.body;
      if (!plant_id || !user_id || !task || !frequency || !description) {
        await connection.close();
        return res.status(400).json({ error: "plant_id, user_id, task, frequency, and description are required" });
      }
      
      // Instead of converting JS date/time strings, we use Oracle's SYSDATE and SYSTIMESTAMP.
      await connection.execute(
        `INSERT INTO Reminder (Reminder_ID, Plant_ID, User_ID, Task_Name, Frequency, Description, Set_Date, Set_Time)
         VALUES (REMINDER_SEQ.NEXTVAL, :plant_id, :user_id, :task, :frequency, :description, SYSDATE, SYSTIMESTAMP)`,
        { plant_id, user_id, task, frequency, description },
        { autoCommit: true }
      );
      await connection.close();
      return res.status(200).json({ message: "Reminder added successfully" });
    } else {
      await connection.close();
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    if (connection) await connection.close();
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
