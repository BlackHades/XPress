"use strict";
const debug = require("debug")("app:debug");
const sendGrid = require("@sendgrid/mail");
class EmailService {
    constructor() {
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.send = this.send.bind(this);
        this.formatTextToEmail = this.formatTextToEmail.bind(this);
    }

    sendMultiple(to = [], subject, msg, from = "no-reply@chiji14xchange.com") {
        const unsubscribe_email = to.join('');
        const unsubscribe_link = Buffer.from(unsubscribe_email).toString('base64');
        
        return sendGrid.sendMultiple(this.formatTextToEmail(to, msg, "customer", subject, from, unsubscribe_link));
    }

    send(to, msg, name = "User", subject, from = "no-reply@chiji14xchange.com") {
        const unsubscribe_email = to.join('');
        const unsubscribe_link = Buffer.from(unsubscribe_email).toString('base64');
        const payload = this.formatTextToEmail(to, msg, name, subject, from, unsubscribe_link);
        return sendGrid.send(payload);
    }

    formatTextToEmail(email, text, name, subject, from, unsubscribe_link) {
        return {
            to: email,
            from,
            subject,
            text,
            html: require("../app/notifications/mailers/MailerHtml")(subject, text, unsubscribe_link)
        };
    }
}

module.exports = (new EmailService());