const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const postController = require("../controllers/post");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Please enter more than 10 words"),
    body("description")
      .isLength({ min: 30 })
      .withMessage("Please add more than 30 words"),
  ],
  postController.createPost
);

//render edit post
router.get("/edit/:postId", postController.getEditPost);

//handle edit post
router.post(
  "/edit-post",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Please enter more than 10 words"),
    body("description")
      .isLength({ min: 30 })
      .withMessage("Please add more than 30 words"),
  ],
  postController.updatePost
);

router.post("/delete/:postId", postController.deletePost);

module.exports = router;
