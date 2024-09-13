import * as nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import Mail from "nodemailer/lib/mailer/index.js";

// point to the template folder
const handlebarOptions: any = {
    viewEngine: {
        partialsDir: "./src/views",
        defaultLayout: false,
    },
    viewPath: "./src/views",
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.use("compile", hbs(handlebarOptions));

export default class EmailService {
    constructor() {}

    sendMail = async (mailOptions: Mail.Options) => {
        try {
            mailOptions.from = process.env.FROM_EMAIL;
            await transporter.sendMail(mailOptions);
        } catch (err: any) {
            console.log(err);
            throw err.message;
        }
    };
}
