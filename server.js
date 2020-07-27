const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");

app.use(express.json({ extended: false }));

connectDB();

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Server static assets in production
if (process.env.NODE_ENV === "production") {
	// Set Static/ public folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
