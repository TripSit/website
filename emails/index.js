import * as path from 'path';
import * as fs from 'fs/promises';
import mjml2html from 'mjml';

export default async function getEmailContents(templateName) {
  const templatePath = path.resolve(`emails/${templateName}.mjml`);
  const template = await fs.readFile(templatePath);
  return mjml2html(template);
}
