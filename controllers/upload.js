const multer = require("multer");
const { Uploads } = require("../models");

exports.findAllUploads = (req, res, next) => {
    res.send('uploads')
}

exports.createUpload = (req, res, next) => {
    const upload = multer({
        dest: "attachments",
        limits: {
          fileSize: 200000,
        },
        fileFilter(req, file, cb) {
          if (!file.originalname.endsWith(".pdf")) {
            return cb(new Error("Only pdf are allowed"));
          }
          cb(undefined, true);
        },
        });
        const { filename, filepath } = req.body
          try {
            req.quote.createUpload({ filename, filepath })
            res.status(201).json({ message: "Uploaded"})
          } catch (err) {
              console.log(err)
              next()
          }
}

exports.deleteUpload = (req, res) => {
    try {
      const theFile = "attachments/" + req.params.file_name;
  
      var resultHandler = function (err) {
        if (err) {
          console.log("file delete failed", err);
          return res.status(500).json(err);
        }
        console.log("file deleted");
        return res.status(200).send({ data: req.params.file_name + " deleted" });
      };
  
      fs.unlinkSync(theFile, resultHandler);
    } catch (e) {
      console.log(e);
    }
  }
