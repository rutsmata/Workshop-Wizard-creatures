const router = require("express").Router();

const postManager = require("../managers/postManager");
const { isAuth } = require("../middlewares/authMiddleware");
const { getErrorMessage } = require("../utils/errorHelpers");

router.get("/all-posts", async (req, res) => {
  const posts = await postManager.getAll().lean();

  res.render("posts/all-posts", { posts });
});

router.get("/create", isAuth, (req, res) => {
  res.render("posts/create");
});

router.post("/create", isAuth, async (req, res) => {
  //get data from both the body and the user, such as all data from the body and owner data from the user. Owner has the same word as in the Photo Model
  const postData = {
    ...req.body,
    owner: req.user._id,
  };

  try {
    await postManager.create(postData);

    res.redirect("/posts/all-posts"); // redirects to the catalog page
  } catch (err) {
    res.render("posts/create", { error: getErrorMessage(err) });
  }
});

router.get("/:postId/details", async (req, res) => {
  const postId = req.params.postId;
  const post = await postManager.getOne(postId).lean();
  const isOwner = req.user?._id == post.owner._id; // prepare a const to keep if the logged-in user is an owner of the photo, to be used in details logic.
  //The ? is optional chaining, e.g if the request has no user (e.g at browsing only) to still working properly and not to crash
  // alternative is user?._id === owner.toString()

  res.render("posts/details", { post, isOwner }); // isOwner is provided as second parameter in order to be cascaded to the template
});

router.get("/:postId/delete", isAuth, async (req, res) => {
  const postId = req.params.postId;
  try {
    await postManager.delete(postId);
    res.redirect("/posts/all-posts"); // redirect to catalog page
  } catch (err) {
    res.render("posts/details", { error: "Unsuccessful deletion!" });
  }
});

router.get("/:postId/edit", isAuth, async (req, res) => {
  const post = await postManager.getOne(req.params.postId).lean();

  res.render("posts/edit", { post }); // second parameter in order to have pre-filled the edit data
});

router.post("/:postId/edit", isAuth, async (req, res) => {
  const postId = req.params.postId;
  const postData = req.body;

  try {
    await postManager.edit(postId, postData);

    res.redirect(`/posts/${postId}/details`); // as per the requirements: current photo post details page
  } catch (err) {
    res.render("posts/edit", {
      error: "Unable to update posts",
      ...postData,
    }); // second parameter to pre-fill the data
  }
});

module.exports = router;
