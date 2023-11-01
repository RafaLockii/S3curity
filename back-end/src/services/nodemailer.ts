const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6bb4f8452c808e",
        pass: "9ef88b2ea00e89"
    }
});