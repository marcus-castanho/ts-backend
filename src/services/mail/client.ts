import { env } from '@/infra/env';
import nodemailer from 'nodemailer';

export const client = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD,
    },
});
