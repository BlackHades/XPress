let crypto = require('crypto');
let fs = require('fs');
const {createSuccessResponse, createErrorResponse} = require('../../../helpers/response');
const config = require('../../../config/config');
const {File} = require('../../../database/sequelize');
const cloudinary = require('cloudinary').v2;
const log = require("../../../helpers/Logger");
/**
 * Check if file has been uploaded before to avoid duplicates using the checksum of the file
 * @param req
 * @param res
 * @param next
 */
const check = async (req,res,next) => {
  //check if checksum is in the db
  let file = await File.findOne({where:{checksum: req.params.checksum}});
  return createSuccessResponse(res, file)
};


/**
 * Upload File
 * @param req
 * @param res
 * @param next
 */
const upload = async (req,res,next) => {
  try{
    //Check if file is part of the request
    if(req.file ===  undefined || req.file === null || req.file === {})
      return createErrorResponse(res,"File Not Found");
    const file = req.file;
    const path = "./public/uploads/" + file.filename;
    const filePath = req.file.path;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    //calculate Checksum
    const checksum = await calculateCheckSum(path);

    let image =  await cloudinary.uploader.upload(filePath,{
      public_id:checksum
    });

    // log("Upload Response: " + JSON.stringify(image));

    // Save File in to Database
    let newFile = await File.findOrCreate({where:{checksum:checksum}, defaults: {
      checksum:checksum,
      url: image.secure_url || image.url,
      mimeType:file.mimetype,
      extras: JSON.stringify(image)
    }});
    fs.unlinkSync(path);
    //Image: id, checksum, url;
    return createSuccessResponse(res, newFile[0],"Upload Successful");
    // return createSuccessResponse(res, new,"Upload Successful");
  }catch (e) {
    return createErrorResponse(res,"An Error Occurred " + JSON.stringify(e));
  }
};


const calculateCheckSum = (path) => {
  return new Promise((resolve,reject) => {
    fs.readFile(path, function(err, data) {
      const checksum = generateChecksum(data);
      console.log(checksum);
      if(checksum)
        resolve(checksum);
      else
        reject("Checksum is undefined");
    });
  });
};

const generateChecksum = (data, algorithm, encoding) => {
  return crypto
      .createHash(algorithm || 'md5')
      .update(data, 'utf8')
      .digest(encoding || 'hex');
};
const checksum = async (req,res,next) => {
  const path = "./public/uploads/e4e0e8d2882f36698a917a796123e7971.PNG";
  const checksum = await calculateCheckSum(path);
  return createSuccessResponse(res, {checksum: checksum});
};


const uploadFromMobile = async (req, res, next) =>{
    const payload = req.body;
    if(payload.file == undefined || payload.file == null || payload.file == "")
        return createErrorResponse(res,"File is empty");

    const path = `./public/uploads/${payload.filename || Math.random().toString().concat(".jpg")}`;
    const bitmap = new Buffer(payload.file, 'base64');

    // console.log("buffer:", JSON.stringify(bitmap));
    // write buffer to file
    fs.writeFileSync(path, bitmap);

    console.log('******** File created from base64 encoded string ********');


    console.log("Here");
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    //calculate Checksum
    const checksum = await calculateCheckSum(path);

    let image =  await cloudinary.uploader.upload(path,{
        public_id:checksum
    });

    log("Upload Response: " + JSON.stringify(image));

    // Save File in to Database
    let newFile = await File.findOrCreate({where:{checksum:checksum}, defaults: {
            checksum:checksum,
            url: image.secure_url || image.url,
            mimeType: payload.filename.split(".")[1],
            extras: JSON.stringify(image)
        }});
    fs.unlinkSync(path);
    //Image: id, checksum, url;
    return createSuccessResponse(res, newFile[0],"Upload Successful");


    // return createSuccessResponse(res,payload,"Image Uploaded");
    //convert back to file
    //calculate checksum
    //upload to cloudinary
    //create Record
    //return res
};


//Export
module.exports = {

    check,
    upload,
    checksum,
    uploadFromMobile
};