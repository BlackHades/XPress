"use strict";
const debug = require("debug")("app:debug");
const sendGrid = require("@sendgrid/mail");
class EmailService {
    constructor(){
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.send = this.send.bind(this);
        this.formatTextToEmail = this.formatTextToEmail.bind(this);
    }



    sendMultiple(to = [], subject, msg, from = "no-reply@ghiji14xchange.com"){

        return sendGrid.sendMultiple(this.formatTextToEmail(to, msg, "customer", subject, from));
    }
    send(to, msg, name = "User", subject,  from = "no-reply@chiji14xchange.com"){
        const payload = this.formatTextToEmail(to,msg, name, subject, from);
        return sendGrid.send(payload);
    }

    formatTextToEmail(email, text, name, subject,from){
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
                                <p>${text}</p>
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