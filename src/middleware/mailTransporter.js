import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { userModel } from '../dao/models/userModel.js';

const SECRET_KEY = config.SECRET;
const TRANSPORT_PASS = config.TRANSPORT_PASS
const TRANSPORT_USER = config.TRANSPORT_USER

export const mailTransporter = async (req, res) => {
    
    const { email } = req.query;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found. Please register.');
        }

        const resetToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        const resetUrl = `http://localhost:8080/api/sessions/reset-password?token=${resetToken}`;

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
            to: email,
            subject: 'Fran Ecommerce, Password Restore',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Restore</title>
                    <style>
                        /* Inline CSS for email */
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
                        .row {
                            display: flex;
                            justify-content: center;
                        }
                        .col-md-6 {
                            width: 50%;
                            border: 1px solid #ccc;
                            padding: 20px;
                            box-sizing: border-box;
                        }
                        .text-center {
                            text-align: center;
                        }
                        .align-middle {
                            vertical-align: middle;
                        }
                        .btn {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background-color: #ffc107;
                            border: none;
                            border-radius: 4px;
                            text-decoration: none;
                            text-align: center;
                            cursor: pointer;
                        }
                        .btn:hover {
                            background-color: ##ffca2c;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Password Restore</h2>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="text-center align-middle">
                                    <span>Click the following button to restore your password</span>
                                </div>
                                <div style="text-align: center; margin-top: 20px;">
                                    <a href="${resetUrl}" class="btn btn-warning">Reset Password</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        console.log('Email sent');
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    };

};