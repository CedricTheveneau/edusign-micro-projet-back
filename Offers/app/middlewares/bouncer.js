const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;
    const userRole = decodedToken.role;
    const userSkills = decodedToken.skills;

    req.auth = {
      userId,
      userRole,
      userSkills
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: "Access denied !",
    });
  }
};