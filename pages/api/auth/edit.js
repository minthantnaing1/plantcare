import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { user_id, name, email, password } = req.body;
  if (!user_id || !name || !email || !password) {
    return res.status(400).json({ error: "user_id, name, email and password are required" });
  }
  
  let connection;
  try {
    connection = await connectToDB();
    await connection.execute(
      `UPDATE Users 
       SET Name = :name, Email = :email, Password = :password 
       WHERE User_ID = :user_id`,
      { name, email, password, user_id },
      { autoCommit: true }
    );
    await connection.close();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    if (connection) await connection.close();
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
