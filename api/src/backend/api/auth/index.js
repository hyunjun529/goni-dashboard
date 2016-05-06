import {
  checkValidRegisterRequest,
  getUser,
  registerUser,
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
      try {
        const userExists = await getUser(req.body.email);
        if (userExists) {
          return res.sendStatus(409);
        }
        const isSuccess = await registerUser(req.body.email, req.body.username, req.body.password);
        if (!isSuccess) {
          return res.sendStatus(400);
        }
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

export default router;
