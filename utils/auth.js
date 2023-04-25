const auth = (req, res, next) => {
    if (req.session.logged_in) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
  module.exports = auth;  