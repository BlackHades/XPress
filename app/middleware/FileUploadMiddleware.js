const multer = require('multer');
const upload = multer({
    dest: 'public/uploads/' // this saves your file into a directory called "uploads in the public folder"
});