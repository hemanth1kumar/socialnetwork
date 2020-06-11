const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.use(express.json({ extended: false }));
const PORT = process.env.PORT || 5000;

connectDB();

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.get("/", (req, res) => {
   res.send("Welcome to Server");
});

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
