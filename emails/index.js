import * as path from 'path';
import * as fs from 'fs/promises';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import {
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_FROM,
} from '../env';

const transporter = nodemailer.createTransport({
  secure: true,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default async function sendEmail(templateName, mail, variables = {}) {
  const templatePath = path.resolve(`emails/${templateName}.hbs`);
  const hbs = await fs.readFile(templatePath);
  const template = compile(hbs);
  return transporter.sendMail({
    from: EMAIL_FROM,
    ...mail,
    html: mjml2html(template(variables)),
  });
}
