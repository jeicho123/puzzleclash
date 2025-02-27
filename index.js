require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" } 
  });

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

// Use client app
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

require("./socket/leaderboardSocket")(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
