const express = require('express')
const multer = require('multer')
const Quote = require('../models/quote')
const router = express.Router()


//get all quotes - w/o pagination
// router.get('/quotes', async(req, res) => {
//     try {
//       const quote = await Quote.findAll()
//     } catch (e) {
//       console.log(e)
//     }

// })

//get all quotes - w/ pagination
router.get('/quotes', async(req, res) => {
    const { page = 1, limit = 10 } = req.query
    try {
      const quotes = await Quote.find()
       .limit(limit * 1)
       .skip((page - 1) * limit)
       .exec();

       const count = await Quote.countDocuments();

       res.json({
        quotes,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (e) {
        console.log(e)
    }
})

// //demo
// router.get('/posts', async (req, res) => {
//     // destructure page and limit and set default values
//     const { page = 1, limit = 10 } = req.query;

//     try {
//       // execute query with page and limit values
//       const posts = await Posts.find()
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .exec();

//       // get total documents in the Posts collection
//       const count = await Posts.countDocuments();

//       // return response with posts, total pages, and current page
//       res.json({
//         posts,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page
//       });
//     } catch (err) {
//       console.error(err.message);
//     }
//   });

//get single quote
router.get('/quotes/id', async (req, res) => {
    const id = req.params.id;
    try {
       const quote = await Quote.findOne(id)
       res.status(200).send(quote)
    } catch (e) {
        console.log(error)
        res.status(404).send(e)
    }
})

//delete a quote
router.delete('/quotes/id', async(req, res) => {
    const id = req.params.id;
    try {
        const quote = await Quote.destroy(id)
        res.status(200)
    } catch (e) {
       console.log(e)
    }
})

//creating a quote
router.post('/quotes', async(req, res) => {
    const data = {
        id: 123456,
        title: 'Custom Tools',
        desc: 'is simply dummy text of the printing and typesetti',
        status: 'PENDING',
        createdAt : "2012-02-01",
        modifiedAt : "2012-02-03"
    }

    let { id, title, desc, status, createdAt, modifiedAt } = data

    try {
       const quote = await Quote.Create({
          title, desc, status, createdAt
       })
       res.redirect('/quote')
    } catch (e) {
        console.log(e)
    }
})

//edit a quote
router.put('/quotes/id', async (req, res) => {
    const id = req.params.id

    const data = {
        title: 'Custom Tools',
        desc: 'is simply dummy text of the printing and typesetti',
        status: 'ACCEPTED',
        createdAt : "2012-02-01",
        modifiedAt : "2012-02-03"
    }

    let { title, desc, status, createdAt, modifiedAt } = data
    try {
        const quote = await Quote.Update({
            title, desc, modifiedAt
        })
        Quote.save()
    } catch (err) {
        console.log(err)
    }

})

//file upload
const upload = multer({
    dest: 'attachments',
    limits: {
        fileSize: 200000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.pdf')) {
           return cb(new Error('Only pdf are allowed'))
        }
        cb(undefined, true)
    }
})

router.post('quotes/id/attachments', upload.single('attachments'), (req, res) => {
    // const id = req.params.id
    res.send()
})

//file delete
router.delete('quotes/id/attachments/:file_name', (req, res) =>
{
    try {
        const theFile = 'attachments/' + req.params.file_name;

        var resultHandler = function(err) {
            if(err) {
            console.log("file delete failed", err);
            return res.status(500).json(err)
            }
            console.log("file deleted");
            return res.status(200).send({data: req.params.file_name + ' deleted'});
        }

        fs.unlinkSync(theFile, resultHandler);
    } catch (e) {
        console.log(e)
    }
});

module.exports = router