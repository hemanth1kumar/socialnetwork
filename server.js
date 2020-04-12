const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Welcome to Server");
});
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
