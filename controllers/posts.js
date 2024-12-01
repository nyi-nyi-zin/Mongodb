const Post = require("../models/posts");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({ title, description, imgUrl: photo, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Post create ml" });
};

exports.renderHomePage = (req, res) => {
  Post.find()
    .select("title")
    .populate("userId", "username")
    .then((posts) => {
      {
        console.log(posts);
        res.render("home", { title: "Home Page", postsArr: posts });
      }
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => res.render("details", { title: "Post Details Page", post }))
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
  //two way to update post
  const postId = req.params.postId;
  const { title, description, photo } = req.body;
  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save();
    })
    .then(() => {
      console.log("post updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.findByIdAndDelete(postId)
    .then(res.redirect("/"))
    .catch((err) => console.log(err));
};
