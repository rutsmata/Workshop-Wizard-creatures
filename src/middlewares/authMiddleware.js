const { SECRET, TOKEN_KEY } = require("../config/constants");
const jwt = require("../lib/jwt");

//Authentication middleware
//check if token exist in the auth cookie.
exports.auth = async (req, res, next) => {
  //derive token from cookies
  const token = req.cookies[TOKEN_KEY]; // equivalent of req.cookies.token

  //check if token is available
  if (token) {
    try {
      //get the decoded token and validate - e.g if our SECRET is same, if token has expired...
      const decodedToken = await jwt.verify(token, SECRET); 
      //record the user info which can be passed to the next middleware. All this means we have valid user
      req.user = decodedToken;
      res.locals.user = decodedToken;
      res.locals.isAuthenticated = true;

      next();
    } catch (err) {
      //if validation is not successful clear the cookie
      res.clearCookie(TOKEN_KEY) 
      // and redirect to login page
      res.redirect("/users/login");
    }
  } else {
    next(); // we allow not logged users to do basic review of our app
  }
};

//Authorization middleware
exports.isAuth = (req, res, next) => {
    //if request has no user then redirect to the home page; if yes - then enter
    if (!req.user) {
        res.redirect('/users/login')
    }

    next();
}