import connectToDB from "../../../lib/oracleDB";
import oracledb from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, Email, and Password are required" });
    }
    const connection = await connectToDB();

    // Check if user already exists
    const existing = await connection.execute(
      "SELECT User_ID FROM Users WHERE Email = :email",
      { email }
    );
    if (existing.rows.length > 0) {
      await connection.close();
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert new user using a sequence for User_ID (ensure USERS_SEQ exists)
    await connection.execute(
      `INSERT INTO Users (User_ID, Name, Email, Password)
       VALUES (USERS_SEQ.NEXTVAL, :name, :email, :password)`,
      { name, email, password },
      { autoCommit: true }
    );

    // Retrieve the newly created user_id by querying with the email
    const result = await connection.execute(
      "SELECT User_ID FROM Users WHERE Email = :email",
      { email }
    );
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(500).json({ error: "Failed to retrieve new user" });
    }

    const newUserId = result.rows[0][0];
    return res.status(201).json({ user_id: newUserId, name, email });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
