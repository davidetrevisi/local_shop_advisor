const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const tokenChecker = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.cookies.token ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  console.log(token);

  // if there is no token
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "No token provided.",
    });
  }

  // decode token, verifies secret and checks exp
  jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({
        success: false,
        message: "Failed to authenticate token.",
      });
    } else {
      req.userId = decoded.id;
      req.email = decoded.email;
      req.userAccount = decoded.account;
      next();
    }
  });
};

module.exports = tokenChecker;
