const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendActivationMail(toEmail, link) {
    await this.transport.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Email orqali faolashtirish",
      text: "",
      html: `
        <div>
          <h3>Akaunti faolshtirish uchun quyidagi linkni bosing:</h3>
          <a href=${link}>Faolashtirish</a>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
