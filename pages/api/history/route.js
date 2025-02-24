import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const connection = await connectToDB();

    // Join Record with Reminder and Notification to retrieve full history details
    const result = await connection.execute(`
      SELECT 
        r.record_id, 
        r.reminder_id, 
        r.date_completed, 
        r.time_completed, 
        rem.task_name,
        n.status
      FROM Record r
      JOIN Reminder rem ON r.reminder_id = rem.reminder_id
      LEFT JOIN Notification n ON n.reminder_id = rem.reminder_id
      ORDER BY r.date_completed DESC, r.time_completed DESC
    `);

    await connection.close();

    const formattedHistory = result.rows.map((row) => ({
      RECORD_ID: row[0],
      REMINDER_ID: row[1],
      DATE_COMPLETED: row[2],
      TIME_COMPLETED: row[3],
      TASK_NAME: row[4],
      STATUS: row[5],
    }));

    return res.status(200).json(formattedHistory);
  } catch (error) {
    return res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
}
