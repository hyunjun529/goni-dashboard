import passport from 'backend/core/passport';
import {
  createProject,
  getProject,
  getProjectList,
} from './core';
import {
  Router,
} from 'express';

const isGoniAllowed = false;

const router = Router();

// Project
router
  .route('/project/:id')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        const project = await getProject(req.params.id, req.user.id);
        if (project) {
          return res.send(project);
        }
        return res.sendStatus(404);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

// Create Project
router
  .route('/project')
  .post(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        if (!req.body.name || !req.body.isPlus) {
          return res.sendStatus(400);
        }
        if (!req.body.isPlus && !isGoniAllowed) {
          return res.sendStatus(400);
        }
        const project = await createProject(req.body.name, req.body.isPlus, req.user.id);
        return res.send({
          id: project,
        });
      } catch (error) {
        return res.sendStatus(500);
      }
    });

// Projects list
router
  .route('/projects')
  .get(
    passport.authenticate('bearer'),
    async(req, res) => {
      try {
        const projects = await getProjectList(req.user.id);
        return res.send(projects);
      } catch (error) {
        return res.sendStatus(500);
      }
    });


export default router;
