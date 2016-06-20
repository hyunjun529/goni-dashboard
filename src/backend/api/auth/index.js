import {
  checkValidRegisterRequest,
  getSlackToken,
  getUser,
  getUserByToken,
  registerSlackToken,
  registerUser,
  registerUserToken,
} from './core';
import {
  getProjectRole,
} from 'backend/api/project/core';
import passport from 'backend/core/passport';
import {
  checkExpired,
} from 'backend/util/time';
import {
  Router,
} from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

// Login
router
  .route('/auth')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      res.send({
        token: req.user.token,
        user: req.user.id,
      });
    })
  .post(
    passport.authenticate('local'),
    async(req, res) => {
      try {
        res.send({
          token: req.user.token,
          user: req.user.id,
        });
      } catch (error) {
        res.sendStatus(500);
      }
    });

// Register
router
  .route('/auth/register')
  .post(
    checkValidRegisterRequest,
    async(req, res) => {
      try {
        const userExists = await getUser(req.body.email);
        if (userExists) {
          return res.sendStatus(409);
        }
        const userId = await registerUser(req.body.email, req.body.username, req.body.password);
        if (!userId) {
          return res.sendStatus(400);
        }
        const auth = await registerUserToken(userId);
        return res.send({
          token: auth,
          user: userId,
        });
      } catch (error) {
        return res.sendStatus(500);
      }
    });

// Register
router
  .route('/auth/notification/slack')
  .get(
    async(req, res) => {
      try {
        const raw = req.query.state;
        if (!raw) {
          return res.redirect('/');
        }
        const state = raw.split('|');
        if (state.length < 2) {
          return res.redirect('/');
        }
        const pid = state[state.length - 1];
        if (!req.query.code) {
          return res.redirect(`/goniplus/${pid}`);
        }
        const token = raw.substr(0, raw.length - pid.length - 1);
        const decoded = jwt.decode(token);
        const tUser = await getUserByToken(token);
        if (tUser === null) {
          return res.redirect('/login');
        }
        if (tUser.user_id !== decoded.id) {
          return res.redirect('/login');
        }
        if (checkExpired(tUser.expired_at)) {
          return res.redirect('/login');
        }
        const role = await getProjectRole(pid, tUser.user_id);
        if (role !== 0) {
          return res.redirect(`/goniplus/${pid}`);
        }
        const credential = await getSlackToken(req.query.code);
        if (credential.error) {
          return res.redirect(`/goniplus/${pid}?dashboard=settings_notification`);
        }
        await registerSlackToken(pid, tUser.user_id, credential);
        return res.redirect(`/goniplus/${pid}?dashboard=settings_notification`);
      } catch (error) {
        return res.redirect('/');
      }
    });

export default router;
