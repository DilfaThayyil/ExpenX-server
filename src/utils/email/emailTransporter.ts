import nodemailer from 'nodemailer';
import { NODEMAILEREMAIL, NODEMAILERPASSWORD } from '../../config/env';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: NODEMAILEREMAIL,
        pass: NODEMAILERPASSWORD
    }
});

export default transporter;
