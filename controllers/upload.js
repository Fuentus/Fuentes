const multer = require("multer");
const { Uploads } = require("../models");
const printLog = require("../util/fuentis_util");

exports.findAllUploads = (req, res, next) => {
    res.send('uploads')
}

exports.createUpload = (req, res, next) => {
  printLog(`Upload : Inside createUpload`);
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
          printLog(`Upload : Exit createUpload`);
}

exports.deleteUpload = (req, res) => {
  printLog(`Upload : Inside deleteUpload`);
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
    printLog(`Upload : Exit deleteUpload`);
  }
