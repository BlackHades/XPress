const PRODUCTION = false;
const HOST = PRODUCTION ? "https://shrouded-lowlands-98587.herokuapp.com/" : "http://localhost:3000/";
const DB_HOST= PRODUCTION ? "" : "localhost";
const DB_USERNAME = "root";
const DB_NAME = "xchange_db";
const DB_PASSWORD = "Goodbetter123";
const SECURITY_KEY = "s9c2ui00m3ryfvzjcql9opgbq7r2y1s39".toUpperCase();

module.exports = {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  SECURITY_KEY,
  HOST
};