import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv();

// email, pass
const email = process.env.EMAIL
const pass = process.env.PASS

// transporter, contenido

const transporter = nodemailer.createTransport({
    service: 'gmail', // outlook, hotmail, yahoo
    auth: {
        user: email,
        pass: pass
    }
})


export async function sendVerifyEmail(userEmail, token) {
    // contenido, emailuser, token
    const link = `http://localhost:3000/api/verify/${token}`

    const content = {
        from: email,
        to: userEmail,
        subject: 'VERIFICA TU CUENTA',
        html: `
            <h1>verifica tu cuenta</h1>
            <p>haz click en el siguiente boton para verificar tu cuenta</p>
            <a href="${link}"> click aqui </a>
        `
    }

    try {
        await transporter.sendMail(content);
        console.log('Correo enviado')

        
    } catch (error) {
        console.log('error: ', error)
        
    }
    
}