import {
  checkValidRegisterRequest,
  getUser,
  registerUser,
  registerUserToken,
} from './core';
import passport from 'backend/core/passport';
import {
  Router,
} from 'express';
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
      let status = 500;
      try {
        const userExists = await getUser(req.body.email);
        if (userExists) {
          return res.sendStatus(409);
        }
        const userId = await registerUser(req.body.email, req.body.username, req.body.password);
        if (!userId) {
          return res.sendStatus(400);
        }
        status = 200;
        const auth = await registerUserToken(userId);
        return res.send({
          token: auth,
          user: userId,
        });
      } catch (error) {
        return res.sendStatus(status);
      }
    });

export default router;
