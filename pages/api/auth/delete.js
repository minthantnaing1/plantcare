import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }
  
  let connection;
  try {
    connection = await connectToDB();
    await connection.execute(
      "DELETE FROM Users WHERE User_ID = :user_id",
      { user_id },
      { autoCommit: true }
    );
    await connection.close();
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    if (connection) await connection.close();
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
