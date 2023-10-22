const router = require("express").Router();

const userManager = require("../managers/userManager");
const postManager = require('../managers/postManager');
const { isAuth } = require("../middlewares/authMiddleware");
const { TOKEN_KEY } = require("../config/constants");
const { getErrorMessage } = require("../utils/errorHelpers");


router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await userManager.login(email, password);

    res.cookie(TOKEN_KEY, token); // create cookie named token and add token info

    res.redirect("/");
  } catch (err) {
    res.status(404).res.render("users/login", { error: getErrorMessage(err) });
  }
});


router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res, next) => {
  const { firstName, lastName, email, password, repeatPassword } = req.body;

  console.log(req.body);
  try {
    const token = await userManager.register({
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
    });

    res.cookie(TOKEN_KEY, token);
    res.redirect("/"); // automated redirect to login page after registration
  } catch (err) {
    res.status(404).res.render("users/register", { error: getErrorMessage(err), email })
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie(TOKEN_KEY);

  res.redirect("/");
});

//only authenticated (logged-in) can access the profile; if not authenticated - error is not verified
router.get("/profile", isAuth , async (req, res) => {
  const posts = await postManager.getByOwner(req.user._id).lean();
  //console.log({posts});

  res.render("posts/my-posts");
});


router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
