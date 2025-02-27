const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");


module.exports = (io) => {
    io.on("connection", (socket) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
          console.log("No token provided. Disconnecting...");
          socket.disconnect();
          return;
        }
    
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          socket.userId = decoded.userId;
    
          socket.on("request_leaderboard", async () => {
            const leaderboard = await User.find().sort({ score: -1 });
            socket.emit("leaderboard_update", leaderboard);
          });

          socket.on("request_puzzlehistory", async () => {
            const user = await User.findById(socket.userId).select("puzzleHistory");
            socket.emit("puzzlehistory_update", user.puzzleHistory);
          });
    
          socket.on("increment_score", async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const user = await User.findById(socket.userId);
            
            let todayEntry = user.puzzleHistory.find(entry => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              return entryDate.getTime() === today.getTime();
            });

            if (todayEntry) {
              todayEntry.puzzlesSolved += 1;
            } else {
              user.puzzleHistory.push({
                date: new Date(),
                puzzlesSolved: 1
              });
            }

            user.score += 1;
            
            await user.save();
    
            socket.emit("puzzlehistory_update", user.puzzleHistory);
            
            const updatedLeaderboard = await User.find().sort({ score: -1 });
            io.emit("leaderboard_update", updatedLeaderboard);
          });
    
        } catch (err) {
          console.log("Invalid token. Disconnecting...");
          socket.disconnect();
        }
    });
};
