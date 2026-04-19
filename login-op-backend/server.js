const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const usersFilePath = path.join(__dirname, "public", "datas", "users.json");
const eventsFilePath = path.join(__dirname, "public", "datas", "events.json");

const loadUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

const loadEvents = () => {
  if (!fs.existsSync(eventsFilePath)) return [];
  return JSON.parse(fs.readFileSync(eventsFilePath, "utf8"));
};
const saveEvents = (events) => fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const users = loadUsers();
  if (users.some((u) => u.email === email))
    return res.json({ success: false, message: "Email already registered" });
  users.push({ name, email, password });
  saveUsers(users);
  res.json({ success: true, message: "Signup successful!" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.name === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  res.json({ message: "Login successful!", user });
});

app.get("/events", (req, res) => res.json(loadEvents()));

app.get("/events/:username", (req, res) => {
  const events = loadEvents().filter((e) => e.name === req.params.username);
  res.json(events);
});

app.post("/events", (req, res) => {
  const events = loadEvents();
  events.push(req.body);
  saveEvents(events);
  res.json({ message: "Event saved successfully!", event: req.body });
});

app.get("/", (req, res) => res.json({ status: "ok", message: "Aigenda Node backend running" }));

app.listen(PORT, () => console.log(`✅ Node backend running at http://localhost:${PORT}`));
