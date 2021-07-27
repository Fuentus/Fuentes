const multer = require("multer");
const db = require("../../models");
const Uploads = db.Uploads
const printLog = require("../../util/log_utils");

exports.findAllUploads = (req, res, next) => {
  printLog(`Uploads : Inside findAllUploads`);
  const uploads = Uploads.findAndCountAll()
  .then((uploads) => {
    res.status(200).send(uploads)
  }).catch((err) => {
      console.log(err)
  })
  printLog(`Uploads : Exit findAllUploads`);
}

exports.findOne = (req, res, next) => {
  printLog(`Uploads : Inside findOne`);
  const { id } = req.params
  const uploads = Uploads.findOne({ where : {id : id}})
  .then((uploads) => {
    res.status(200).send(uploads)
  }).catch((err) => {
      console.log(err)
  })
  printLog(`Uploads : Exit findOne`);
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
        const { fileName, filePath, QuoteId } = req.body
          try {
            Uploads.create({
              fileName : fileName,
              filePath : filePath,
              QuoteId : QuoteId
            })
            res.status(201).json({ message: "Uploaded"})
          } catch (err) {
              console.log(err)
              next()
          }
          printLog(`Upload : Exit createUpload`);
}

exports.deleteUpload = (req, res) => {
  printLog(`Upload : Inside deleteUpload`);
    // try {
    //   const theFile = "attachments/" + req.params.file_name;

    //   var resultHandler = function (err) {
    //     if (err) {
    //       console.log("file delete failed", err);
    //       return res.status(500).json(err);
    //     }
    //     console.log("file deleted");
    //     return res.status(200).send({ data: req.params.file_name + " deleted" });
    //   };

    //   fs.unlinkSync(theFile, resultHandler);
    // } catch (e) {
    //   console.log(e);
    // }
    const { id } = req.params
    try {
      const uploads = Uploads.destroy({where : {id : id}})
      res.sendStatus(200)
      next()
    } catch (err) {
      console.log(err)
    }
    printLog(`Upload : Exit deleteUpload`);
  }
