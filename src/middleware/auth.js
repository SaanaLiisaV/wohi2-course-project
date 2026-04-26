const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;


function authenticate(req, res, next) { // next function passes control to the next middleware in the line

  // Reads the Authorization header from the HTTP request
  const authHeader = req.headers.authorization;
  
  // Checks if the header exists and it starts with Bearer
if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Splits the string into an array [0]="Bearer" [1]=token
  // [1] accesses the second element in the array -> the token
  const token = authHeader.split(" ")[1];

  try {
    // Extracts and verifies the JWT token using the secret
    const decoded = jwt.verify(token, SECRET);
    // If valid, attaches the decoded user data to req.user and calls next()
    req.user = decoded;
    // Pass control to the next middleware
    next();
  } catch (err) {
    // If invalid, returns a 401 or 403 error
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticate;
