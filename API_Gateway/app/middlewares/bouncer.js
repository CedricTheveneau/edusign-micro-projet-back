const axios = require("axios");
const proxyURIAuth = process.env.PROXY_URI_AUTH;

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const response = await axios.get(`${proxyURIAuth}/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { userId, userRole } = response.data;

      req.userRole = userRole;
      req.userId = userId;
    } else {
      req.userRole = "guest";
    }

    const path = req.path;

    if (path.startsWith("/api/offers")) {
      if (req.method === "POST") {
        if (userRole !== "admin") {
          return res
            .status(403)
            .json({ error: "Only admins can create offers." });
        }
      } else if (req.method === "PUT") {
        if (userRole === "guest") {
          return res
            .status(403)
            .json({ error: "Only connected users can interact with offers." });
        }
      }
    }

    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "Something went wrong while checking the user's role." });
  }
};
