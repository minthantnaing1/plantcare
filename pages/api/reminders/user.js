import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "User id required" });
  }
  
  let connection;
  try {
    connection = await connectToDB();
    const result = await connection.execute(
      `SELECT 
          r.Reminder_ID,
          p.Plant_Name,
          p.Species,
          p.Watering_Frequency,
          p.Fertilizing_Frequency,
          p.LeafCleaning_Frequency,
          r.Task_Name,
          r.Frequency,
          r.Description,
          TO_CHAR(r.Set_Date, 'YYYY-MM-DD') AS Set_Date,
          TO_CHAR(r.Set_Time, 'YYYY-MM-DD HH24:MI:SS') AS Set_Time
       FROM Reminder r
       JOIN Plant p ON r.Plant_ID = p.Plant_ID
       WHERE r.User_ID = :user_id`,
      { user_id: Number(user_id) }
    );
    await connection.close();
    
    const formattedData = result.rows.map(row => ({
      REMINDER_ID: row[0],
      PLANT_NAME: row[1],
      SPECIES: row[2],
      WATERING_FREQUENCY: row[3],
      FERTILIZING_FREQUENCY: row[4],
      LEAFCLEANING_FREQUENCY: row[5],
      TASK_NAME: row[6],
      FREQUENCY: row[7],
      DESCRIPTION: row[8],
      SET_DATE: row[9],
      SET_TIME: row[10]
    }));
    
    return res.status(200).json(formattedData);
  } catch (error) {
    if (connection) await connection.close();
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
