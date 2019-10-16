"use strict";
const axios = require("axios");
const baseUrl = "https://www.multitexter.com/tools/geturl/Sms.php";
class SMSService{
    constructor(){
        this.send = this.send.bind(this);
        this.sendMultiple = this.sendMultiple.bind(this);
    }

    sendMultiple(phoneNumbers = [], message){
        return Promise.all(phoneNumbers.map(phoneNumber => {
            this.send(phoneNumber, message);
        }));
    }

    send(phoneNumber, message, sender){
        return axios.get(baseUrl,{
            params:{
                username: process.env.SMS_USERNAME,
                password: process.env.SMS_PASSWORD,
                sender: sender || "chiji14xchange",
                message: `${message} -- ${sender || "chiji14xchange"}`,
                forcednd: 1,
                recipients: phoneNumber
            }
        });
    }
}

module.exports = (new SMSService());