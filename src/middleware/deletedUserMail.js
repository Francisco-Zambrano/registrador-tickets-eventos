import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const TRANSPORT_PASS = config.TRANSPORT_PASS;
const TRANSPORT_USER = config.TRANSPORT_USER;

export const userDeletedMail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: TRANSPORT_USER,
                pass: TRANSPORT_PASS
            }
        });

        const info = await transporter.sendMail({
            from: 'Fran Ecommerce <fran.zambrano16@gmail.com>',
            to: user.email,
            subject: 'Your account has been deleted due to inactivity',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cuenta Eliminada</title>
                    <style>
                        .container {
                            width: 100%;
                            margin: 0 auto;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                        }
                        h2 {
                            margin-bottom: 20px;
                            font-size: 24px;
                            text-align: center;
                        }
                        p {
                            text-align: center;
                            font-size: 18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Account deleted due to inactivity</h2>
                        <p>Hello ${user.first_name},</p>
                        <p>We regret to inform you that your account has been deleted due to inactivity in the last 2 days.</p>
                        <p>If this has been an error, please contact us.</p>
                    </div>
                </body>
                </html>
            `
        });

        console.log(`Email sent to ${user.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};