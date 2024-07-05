const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "77d5d0001@smtp-brevo.com",
        pass: "USvtYas91BcJyCrn"
    }
})

module.exports = async (email, otp) => {

    const info = await transporter.sendMail({
        from: 'bhavya <bhavya@chicmic.co.in>',
        to: email,
        subject: "verification OTP",
        text: `Your OTP is ${otp}`,
    })

}