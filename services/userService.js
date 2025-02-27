const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ username, password: hashedPassword });
};