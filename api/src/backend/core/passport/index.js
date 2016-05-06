import passport from 'passport';
import {
  Strategy as LocalStrategy,
} from 'passport-local';
import {
  Strategy as BearerStrategy,
} from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import {
  getUser,
  getUserByToken,
  registerUserToken,
} from 'backend/api/auth/core';
import {
  checkPassword,
} from 'backend/util/auth';
import {
  checkExpired,
} from 'backend/util/time';

// Passport

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
}, async(req, email, password, done) => {
  try {
    const user = await getUser(email);
    if (!user) {
      return done(null, false, {
        msg: 'USER_NOT_EXISTS',
      });
    }
    const isValid = checkPassword(user.password,
      password, user.salt);
    if (!isValid) {
      return done(null, false, {
        msg: 'WRONG_PASSWORD',
      });
    }
    const token = await registerUserToken(user.id);
    return done(null, {
      id: user.id,
      token,
    });
  } catch (error) {
    return done(error);
  }
}));

passport.use(new BearerStrategy(
  async(token, done) => {
    try {
      // TODO : jwt.verify로 변경해야함 : 현재 verify를 사용할 시 무조건 Error가 throw되는 문제가 있음.
      const decoded = jwt.decode(token);
      const tUser = await getUserByToken(token);
      if (tUser === null) {
        return done(null, false, {
          msg: 'USER_NOT_EXISTS',
        });
      }
      if (tUser.user_id !== decoded.id) {
        return done(null, false, {
          msg: 'INVALID_TOKEN',
        });
      }
      if (checkExpired(tUser.expired_at)) {
        return done(null, false, {
          msg: 'TOKEN_EXPIRED',
        });
      }
      return done(null, {
        id: tUser.user_id,
        token,
      });
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;
