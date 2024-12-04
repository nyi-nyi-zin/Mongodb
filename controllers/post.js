//Import Post Schema
const Post = require("../models/posts");

exports.createPost = (req, res) => {
  console.log(req.user);
  const { title, description, photo } = req.body;
  Post.create({ title, description, imgUrl: photo, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Post create ml" });
};

//Render home page
exports.renderHomePage = (req, res) => {
  Post.find()
    .select("title")
    .populate("userId", "email")
    .then((posts) => {
      {
        res.render("home", {
          title: "Home Page",
          postsArr: posts,
          currentUserEmail: req.session.userInfo
            ? req.session.userInfo.email
            : "",
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) =>
      res.render("details", {
        title: "Post Details Page",
        post,
        currentLoginUserId: req.user ? req.user._id : "",
      })
    )
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  //two way to update post,From the params and from the req.body
  const postId = req.params.postId;
  const { title, description, photo } = req.body;

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      post.imgUrl = photo;

      return post.save().then(() => {
        res.redirect("/");
      });
    })

    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.deleteOne({ _id: postId, userId: req.user._id })
    .then(res.redirect("/"))
    .catch((err) => console.log(err));
};
