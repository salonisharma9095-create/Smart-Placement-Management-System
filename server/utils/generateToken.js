const jwt = require("jsonwebtoken");

// user ki id lekar ek JWT token banata hai
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token 30 din tak valid rahega
  });
};

module.exports = generateToken;