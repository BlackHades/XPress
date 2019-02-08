const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, callback) => {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return callback(err);
            let temp =  file.originalname.toString().split(".");
            callback(null, raw.toString('hex') + "." + temp[temp.length - 1]);
        });
    }
});
const upload = multer({storage: storage});


//Controllers
const fileController = require('../../app/api/files/FileController');

//Route
router.get('/check/:checksum', fileController.check);
router.post('/upload',upload.single('file'), fileController.upload);

//Export
module.exports = router;

