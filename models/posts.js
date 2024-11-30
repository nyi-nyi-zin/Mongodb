//Open Connection
const { getDatabase } = require("../utils/database");
const mongodb = require("mongodb");

class Post {
  constructor(title, description, imgUrl, id) {
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this._id = id ? mongodb.ObjectId.createFromHexString(id) : null;
  }

  create() {
    const db = getDatabase();
    let dbTmp;

    if (this._id) {
      //update
      dbTmp = db
        .collection("posts")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbTmp = db.collection("posts").insertOne(this);
    }
    return dbTmp.then((result) => {}).catch((err) => console.log(err));
  }

  static getPosts() {
    const db = getDatabase();
    return db
      .collection("posts")
      .find()
      .sort({ _id: -1 })
      .toArray()
      .then((posts) => {
        return posts;
      })
      .catch((err) => console.log(err));
  }

  static getPost(postId) {
    const db = getDatabase();
    return db
      .collection("posts")
      .find({ _id: mongodb.ObjectId.createFromHexString(postId) })
      .next()
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }

  static deletePost(postId) {
    const db = getDatabase();
    return db
      .collection("posts")
      .deleteOne({ _id: mongodb.ObjectId.createFromHexString(postId) })
      .then()
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Post;
