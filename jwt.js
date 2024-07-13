const jwt = require("jsonwebtoken");



const jwtMiddleware = (req, res, next) => {
  // frist check the request headers has authorization or not

  const authorizaton = req.headers.authorization;
  if (!authorizaton) return res.status(401).json({ error: "Token not found" });
  
  // Extract the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1]; // Corrected the split method

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Corrected the verify method
    // Attach the user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT Token
const generateToken = (userData) => {
  // Generate a new token using user data
  return jwt.sign(userData, process.env.JWT_SECRET); // expiresIn format is correct   { expiresIn: "1h" }
};

module.exports = { jwtMiddleware, generateToken };
