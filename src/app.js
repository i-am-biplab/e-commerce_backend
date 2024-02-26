require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./models/index");

const authRoutes = require("./routes/authRoutes");

const port = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello from the server");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});