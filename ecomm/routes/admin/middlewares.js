const { validationResult } = require("express-validator");

// all middleware funtions must have (req, res, next(basically a callback))
module.exports = {
  // Returns errors in relation to the template passed to this function
  handleErrors(templateFunc, dataCB) {
    return async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let data = {};
        if (dataCB) {
          data = await dataCB(req);
        }
        return res.send(templateFunc({ errors, ...data }));
      }
      next();
    };
  },
  // Checks if the user is logged in
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },
};
