import connectToDB from "../../lib/oracleDB";

export default async function handler(req, res) {
  try {
    const connection = await connectToDB();

    // Fetch data from all tables
    const users = await connection.execute(`SELECT * FROM USERS`);
    const plants = await connection.execute(`SELECT * FROM PLANT`);
    const reminders = await connection.execute(`SELECT * FROM REMINDER`);
    const notifications = await connection.execute(`SELECT * FROM NOTIFICATION`);
    const records = await connection.execute(`SELECT * FROM RECORD`);

    await connection.close();

    // Function to format results into JSON objects
    const formatData = (result) => {
      const columns = result.metaData.map(col => col.name);
      return result.rows.map(row =>
        Object.fromEntries(row.map((val, index) => [columns[index], val]))
      );
    };

    // Send all data as formatted JSON objects
    res.status(200).json({
      users: formatData(users),
      plants: formatData(plants),
      reminders: formatData(reminders),
      notifications: formatData(notifications),
      records: formatData(records),
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
}
