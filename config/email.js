const nodemailer = require("nodemailer");

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "gmail",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Funcion para enviar un correo de restablecimiento  de contraseña
const sendResetPassword = async (to, resetUrl) => {
    try {
        const mailOption = {
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Restablecimiento de contraseña',
            html: `<b>Solicitaste el restablecimiento de tu contraseña?</b>
            <p>Haz click en el siguiente enlace para restablecer tu contraseña</p>
            <a href="${resetUrl}" target="_black">REntablecer contraseña</a>
            <p>Este enlace expira en 1h</p>
            <p>Si no fuiste tu ignoralo</p>
            `,
        };
        const info = await transporter.sendMail(mailOption);
        console.log("Correo enviado exitosamente", info.messageId);
        return true;

    } catch (err) {
        console.error("Error al enviar correo", err);
    }
};

module.exports = {
    transporter,
    sendResetPassword
}