import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV;

export const EMAIL_USER = process.env.EMAIL_SERVER_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
export const EMAIL_HOST = process.env.EMAIL_SERVER_HOST;
export const EMAIL_PORT = process.env.EMAIL_SERVER_PORT;
export const EMAIL_FROM = process.env.EMAIL_FROM;
