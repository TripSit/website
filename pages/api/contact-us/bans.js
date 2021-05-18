import getEmailContents from '../../../emails';
import withSession from '../../../utils/api/with-session';
import sendEmail from '../../../utils/api/send-email';

async function banAppealApiRoute(req, res) {
  const emailContents = await getEmailContents('ban-appeal');
  await sendEmail('Ban Appeal', 'appeal@tripsit.me', emailContents);
  res.sendStatus(201);
}

export default withSession(banAppealApiRoute);
