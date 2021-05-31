import sendEmail from '../../../emails';
import withSession from '../../../utils/api/with-session';

async function banAppealApiRoute(req, res) {
  await sendEmail(
    'ban-appeal',
    {
      subject: 'Ban Appeal',
      from: 'appeal@tripsit.me',
      to: 'foo@example.com', // TODO
    },
    {
      understanding: req.body.understanding,
      clarification: req.body.clarification,
      assurance: req.body.assurance,
    },
  );
  res.sendStatus(201);
}

export default withSession(banAppealApiRoute);
