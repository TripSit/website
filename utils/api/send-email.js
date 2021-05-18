import nodemailer from 'nodemailer';
import {
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_FROM,
} from '../../env';

const transporter = nodemailer.createTransport({
  secure: true,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default function sendEmail(fn) {
  return () => transporter.sendMail({
    from: EMAIL_FROM,
    to: 'appeals@tripsit.me',
    subject: 'Ban Appeal',
    html: '<p>Sale</p>',
  });
}
