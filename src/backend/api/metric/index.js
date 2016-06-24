import _ from 'lodash';
import passport from 'backend/core/passport';
import {
  projectAccessCheckByKey,
} from 'backend/util/project';
import {
  getAPIDetailByTime,
  getAPIMetrics,
  getAPIRealtime,
  getAPIStatistics,
  getAPIStatisticsByTime,
  getDashboardCPU,
  getExpvar,
  getInstances,
  getPaths,
  getRuntime,
} from './core';
import {
  Router,
} from 'express';

const router = Router();

const validMetric = ['expvar', 'runtime'];
const validAPIMetric = ['response'];
const validTime = ['30m', '1h', '3h', '6h'];

// GoniPlus
// Overview
router
  .route('/goniplus/:key/overview/dashboard/cpu')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        const results = await getDashboardCPU(req.params.key);
        const processed = {};
        _.forEach(results, (v) => {
          if (v.max !== null) {
            processed[new Date(v.time) / 1000] = Math.floor(v.max * 100);
          }
        });
        return res.send(processed);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

router
  .route('/goniplus/:key/overview/dashboard/cpu/:time')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        const results = await getAPIStatisticsByTime(req.params.key, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

router
  .route('/goniplus/:key/overview/dashboard/cpu/:time/apidetail')
  .post(
    async(req, res) => {
      try {
        const results = await getAPIDetailByTime(req.params.key, req.body.path, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

router
  .route('/goniplus/:key/overview/dashboard/realtime')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        const results = await getAPIRealtime(req.params.key);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

// Common metric
// Instances
router
  .route('/goniplus/:key/:metric/instances')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        if (_.indexOf(validMetric, req.params.metric) === -1) {
          return res.sendStatus(400);
        }
        const results = await getInstances(req.params.key, req.params.metric);
        const processed = _.map(results, (v) => {
          return {
            value: v,
            label: v,
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
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          return res.sendStatus(400);
        }
        // TODO : return 400 if project is not goniplus project
        const results = await getRuntime(req.params.key, req.params.instance, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

// Expvar
router
  .route('/goniplus/:key/expvar/:instance/:time')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        if (_.indexOf(validTime, req.params.time) === -1) {
          return res.sendStatus(400);
        }
        // TODO : return 400 if project is not goniplus project
        const results = await getExpvar(req.params.key, req.params.instance, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

// API Metric
// Path
router
  .route('/goniplus/:key/:metric/paths')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        if (_.indexOf(validAPIMetric, req.params.metric) === -1) {
          return res.sendStatus(400);
        }
        const results = await getPaths(req.params.key);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

router
  .route('/goniplus/:key/response/:time')
  .post(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        const results = await getAPIMetrics(req.params.key, req.body.path, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

router
  .route('/goniplus/:key/response/statistics/:time')
  .post(
    passport.authenticate('bearer'),
    projectAccessCheckByKey,
    async(req, res) => {
      try {
        const results = await getAPIStatistics(req.params.key, req.body.path, req.params.time);
        return res.send(results);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  );

export default router;
