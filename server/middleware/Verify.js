const { verify } = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    res.json({ status: "NOT_AUTHORIZED" });
  } else {
    verify(accessToken, "secret123", (err, data) => {
      if (err) {
        res.json({ status: "NOT_AUTHORIZED" });
      } else {
        req.user = data;
        next();
      }
    });
  }
};

module.exports = { verifyToken };
