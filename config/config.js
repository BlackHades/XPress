const PRODUCTION = false;
const LOCAL_HOST = "http://localhost:3000/";
const LIVE_HOST = "http://localhost:3000/";
const DB_HOST= "localhost";
const DB_USERNAME = "root";
const DB_NAME = "xchange_db";
const DB_PASSWORD = "Goodbetter123";

const SECURITY_KEY = "s9c2ui00m3ryfvzjcql9opgbq7r2y1s39".toUpperCase();

const HOST =() =>{
  if(PRODUCTION)
    return LIVE_HOST;

  return LOCAL_HOST;
};

module.exports = {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  SECURITY_KEY,
  HOST
};