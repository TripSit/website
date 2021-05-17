import { withIronSession } from 'next-iron-session';
import { DateTime } from 'luxon';

export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'tripsit/main-website/session',
    cookieOptions: {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      expires: DateTime.now().plus({ hours: 4 }).toJSDate(),
    },
  });
}
