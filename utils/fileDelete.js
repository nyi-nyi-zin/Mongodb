const fs = require("fs");

exports.fileDelete = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log("photo was deleted");
  });
};
