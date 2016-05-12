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
        const result = await registerUser(req.body.email, req.body.username, req.body.password);
        if (!result) {
          return res.sendStatus(400);
        }
        status = 200;
        const id = result.insertId;
        const auth = await registerUserToken(id);
        return res.send({
          token: auth,
          user: id,
        });
      } catch (error) {
        return res.sendStatus(status);
      }
    });

export default router;
