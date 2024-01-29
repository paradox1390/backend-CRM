import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const mailer = async (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      throw new Error("Failed to send mail.");
    }
    return info;
  });
};

export const successRegistrationMsg = (email, password) => {
  return {
    from: "InstaCRM Testing registation <mail@v-opravi.com.ua>",
    to: email,
    subject: "Вітаємо з успішною регістрацією",
    text: `Вітаємо, ви успішно пройшли регістрацію в InstaCRM
    Ваші дані для авторизації:
    email: ${email}
    password: ${password}
    `,
  };
};

export const sendConfirmedCodeMsg = (email, code) => {
  return {
    from: "InstaCRM Confirmed Code <mail@v-opravi.com.ua>",
    to: email,
    subject: "Код підтвердження регістрації",
    text: `Ваш код підтвердження регістрації в InstaCRM
      code: ${code}
      `,
  };
};
