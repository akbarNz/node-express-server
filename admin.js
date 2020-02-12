const jwt = require("jsonwebtoken");

module.exports = {
    validateToken: (req, res, next) => {
          const authHeader = req.headers.authorization;
          let result;
          if (authHeader) {
            const token = req.headers.authorization.split(" ")[1];
            try {
              result = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: "2d"});
              req.decoded = result;
              next();
            }
            catch (err) {
              throw new Error (err);
            }
          } else {
            result = { 
              error: `Authentication error. Token required.`,
              status: 401
            };
            res.status(401).send(result);
          }
    },
}