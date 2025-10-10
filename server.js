const express = require("express");
const path = require("path");

const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Marketplace's server");
});

app.get("/users", async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/market", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "market.html"));
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "post.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
