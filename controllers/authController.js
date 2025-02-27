const userService = require("../services/userService");
const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    await userService.createUser(username, password);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const { token, user } = await authService.loginUser(username, password);
      res.json({ token, user });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
