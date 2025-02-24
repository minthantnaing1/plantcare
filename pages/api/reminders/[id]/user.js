import connectToDB from "../../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { id } = req.query;
  const reminderId = Number(id);
  if (isNaN(reminderId)) {
    return res.status(400).json({ error: "Invalid reminder id" });
  }
  
  let connection;
  try {
    connection = await connectToDB();
    const result = await connection.execute(
      "DELETE FROM Reminder WHERE Reminder_ID = :reminderId",
      { reminderId },
      { autoCommit: true }
    );
    await connection.close();
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    
    return res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    if (connection) await connection.close();
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
