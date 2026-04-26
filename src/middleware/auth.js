const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

// next function passes control to the next middleware in the line
function authenticate(req, res, next) {

  // Reads the Authorization header from the HTTP request
  const authHeader = req.headers.authorization;
  
  // Checks it starts with Bearer
if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Extracts and verifies the JWT token using the secret
    const decoded = jwt.verify(token, SECRET);
    // If valid, attaches the decoded user data to req.user and calls next()
    req.user = decoded;
    next();
  } catch (err) {
    // If invalid, returns a 401 or 403 error
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticate;
