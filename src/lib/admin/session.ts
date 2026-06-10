import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type AdminSession = {
  adminId?: string;
  email?: string;
  role?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET!,
  cookieName: 'truckinghub_admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}
