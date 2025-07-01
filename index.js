// index.js
const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());

async function getDb() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

app.get("/users", async (req, res) => {
  const conn = await getDb();
  const [rows] = await conn.query("SELECT * FROM users");
  res.json(rows);
  await conn.end();
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const conn = await getDb();
  const [result] = await conn.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  res.status(201).json({ id: result.insertId });
  await conn.end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
