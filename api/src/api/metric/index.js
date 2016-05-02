import _ from 'lodash';
import passport from 'core/passport';
import {
  getExpvar,
  getRuntime,
} from 'core/metric';
import {
  Router,
} from 'express';

const router = Router();

const validTime = ['30m', '1h', '3h', '6h'];

// GoniPlus
// Runtime
router
  .route('/goniplus/:key/runtime/:time')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          res.sendStatus(400);
        } else {
          // TODO : check if user can access project
          // TODO : return 400 if project is not goniplus project
          const results = await getRuntime(req.params.key, req.params.time);
          res.send(results);
        }
      } catch (error) {
        res.sendStatus(500);
      }
    });

router
  .route('/goniplus/:key/expvar/:time')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          res.sendStatus(400);
        } else {
          // TODO : check if user can access project
          // TODO : return 400 if project is not goniplus project
          const results = await getExpvar(req.params.key, req.params.time);
          res.send(results);
        }
      } catch (error) {
        res.sendStatus(500);
      }
    });

export default router;
