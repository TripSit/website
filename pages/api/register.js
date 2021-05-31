import sendEmail from '../../emails';

export default async function registerApiRoute(req, res) {
  if (req.body.email) {
    // Move this to API
    await sendEmail(
      'verification',
      {
        subject: 'Tripsit Verification',
        from: 'noreply@tripsit.me',
        to: req.body.email,
      },
      {
        nick: 'TODO',
        validationUrl: 'https://example.com/codeTODO',
      },
    );
  }
  res.sendStatus(201);
}
