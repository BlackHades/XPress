"use strict";
const debug = require("debug")("app:debug");
const sendGrid = require("@sendgrid/mail");
class EmailService {
    constructor(){
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.send = this.send.bind(this);
        this.formatTextToEmail = this.formatTextToEmail.bind(this);
    }



    sendMultiple(to = [], msg){
        return Promise.all(to.map(t => {
            this.send(t, msg)
                .then(res => resolve(res))
                .catch(err => reject(err));
        }));
    }

    send(to, msg, name = "User", subject){
        const payload = this.formatTextToEmail(to,msg, name, subject);
        return sendGrid.send(payload);
    }

    formatTextToEmail(email, text, name, subject, from = "no-reply@chiji14xchange.com'"){
        return {
            to: email,
            from ,
            subject,
            text,
            html: `<!DOCTYPE html>
                        <html>
                        
                        <head>
                            <title>${subject}</title>
                        </head>
                        
                        <body>
                            <div>
                                <h3>Dear ${name},</h3>
                                <p>${message}</p>
                                <br>
                                <p>Cheers!</p>
                            </div>
                           
                        </body>
                        
                        </html>
                        `,
        };
    }
}

module.exports = (new EmailService());