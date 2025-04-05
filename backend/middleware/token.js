const jwt = require('jsonwebtoken');

const token = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🔐 Incoming authHeader:', authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ auth: authHeader });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email } from your token
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = token;
