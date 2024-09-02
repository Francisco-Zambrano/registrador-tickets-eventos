import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const TRANSPORT_USER = config.TRANSPORT_USER;
const TRANSPORT_PASS = config.TRANSPORT_PASS;

export const sendPurchaseMail = async (email, products, amount) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: TRANSPORT_USER,
                pass: TRANSPORT_PASS,
            },
        });

        const productDetails = products.map(item => {
            return `<li> Quantity: ${item.quantity} - Price: ${item.price}</li>`;
        }).join('');

        const info = await transporter.sendMail({

            from: 'Fran Ecommerce <fran.zambrano16@gmail.com>',
            to: email,
            subject: 'Purchase Completed',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Purchase Completed</title>
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
                            background-color: #28a745;
                            border: none;
                            border-radius: 4px;
                            text-decoration: none;
                            text-align: center;
                            cursor: pointer;
                        }
                        .btn:hover {
                            background-color: #218838;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Purchase Completed</h2>
                        <div class="text-center">
                            <p>Thank you for your purchase! Here are the details of your order:</p>
                            <ul>${productDetails}</ul>
                            <p><strong>Total Amount: $${amount}</strong></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('Purchase email sent');
    } catch (error) {
        console.error('Error sending purchase email:', error);
        throw new Error('Error sending purchase email');
    }

};