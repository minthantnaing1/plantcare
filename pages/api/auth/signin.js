import connectToDB from "../../../lib/oracleDB";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }
    const connection = await connectToDB();
    const result = await connection.execute(
      "SELECT User_ID, Name, Email FROM Users WHERE Email = :email AND Password = :password",
      { email, password }
    );
    await connection.close();
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid email or password" });
    }
    const userRow = result.rows[0];
    const user = {
      user_id: userRow[0],
      name: userRow[1],
      email: userRow[2]
    };
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
