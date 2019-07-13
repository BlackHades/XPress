"use strict";

const sendGrid = require("@sendgrid/mail");

class EmailService {
    constructor(){
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.send = this.send.bind(this);
    }



    sendMultiple(to = [], msg){
        return Promise.all(to.map(t => {
            this.send(t, msg)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }));
    }

    send(to, msg){
        return sendGrid.send(msg);
    }
}

module.exports = (new EmailService());