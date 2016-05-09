import _ from 'lodash';
import passport from 'backend/core/passport';
import {
  getExpvar,
  getInstances,
  getRuntime,
} from './core';
import {
  Router,
} from 'express';

const router = Router();

const validMetric = ['expvar', 'runtime'];
const validTime = ['30m', '1h', '3h', '6h'];

// GoniPlus
// Instances
router
  .route('/goniplus/:key/:metric/instances')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (_.indexOf(validMetric, req.params.metric) === -1) {
          return res.sendStatus(400);
        }
        const results = await getInstances(req.params.key, req.params.metric);
        const processed = _.map(results, (o) => {
          return {
            value: o.instance,
            label: o.instance,
          };
        });
        return res.send(processed);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

// Runtime
router
  .route('/goniplus/:key/runtime/:instance/:time')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          return res.sendStatus(400);
        }
        // TODO : check if user can access project
        // TODO : return 400 if project is not goniplus project
        const results = await getRuntime(req.params.key, req.params.instance, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

router
  .route('/goniplus/:key/expvar/:instance/:time')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          return res.sendStatus(400);
        }
        // TODO : check if user can access project
        // TODO : return 400 if project is not goniplus project
        const results = await getExpvar(req.params.key, req.params.instance, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

export default router;