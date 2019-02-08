let crypto = require('crypto');
let fs = require('fs');
const {createSuccessResponse, createErrorResponse} = require('../../../helpers/response');
const config = require('../../../config/config');
const {File} = require('../../../database/sequelize');
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
    const url = config.HOST + "uploads/" + file.filename;

    //calculate Checksum
    const checksum = await calculateCheckSum(path);

    //Save File in to Database
    let newFile = await File.findOrCreate({where:{checksum:checksum}, defaults: {
      checksum:checksum,
      url: url,
      mimeType:file.mimetype,
      extras: JSON.stringify(file)
    }});
    //Image: id, checksum, url;
    return createSuccessResponse(res, newFile[0],"Upload Successful");
  }catch (e) {
    next(e);
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



//Export
module.exports = {
  check,
  upload,
  checksum
};