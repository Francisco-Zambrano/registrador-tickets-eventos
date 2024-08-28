import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const TRANSPORT_USER = config.TRANSPORT_USER;
const TRANSPORT_PASS = config.TRANSPORT_PASS;

export const sendDeleteProductMail = async (email, productTitle) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: TRANSPORT_USER,
                pass: TRANSPORT_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: 'Fran Ecommerce <fran.zambrano16@gmail.com>',
            to: email,
            subject: 'Removed Product',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Removed Product</title>
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
                        .text-center {
                            text-align: center;
                        }
                        .btn {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background-color: #ff6347;
                            border: none;
                            border-radius: 4px;
                            text-decoration: none;
                            text-align: center;
                            cursor: pointer;
                        }
                        .btn:hover {
                            background-color: #ff4500;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Removed Product</h2>
                        <div class="text-center">
                            <p>the product <strong>${productTitle}</strong> has been removed from our records.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('Product removal email sent');
    } catch (error) {
        console.error('Error sending product removal email:', error);
        throw new Error('Error sending product removal email');
    }
};
