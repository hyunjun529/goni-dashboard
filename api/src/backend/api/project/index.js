import passport from 'backend/core/passport';
import {
  projectAccessCheck,
} from 'backend/util/project';
import {
  addUserToProject,
  createProject,
  getProject,
  getProjectList,
  getProjectMemberList,
  getProjectRole,
  getSlackIntegrationData,
  getUser,
  removeSlackIntegrationFromProject,
  removeUserFromProject,
} from './core';
import {
  Router,
} from 'express';

const isGoniAllowed = false;
const ROLE_ADMIN = 0;
const ROLE_MEMBER = 0;

const router = Router();

// Project
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

router
  .route('/project/:id')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheck,
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

router
  .route('/project/:id/member')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheck,
    async(req, res) => {
      try {
        const member = await getProjectMemberList(req.params.id);
        if (member) {
          return res.send(member);
        }
        return res.sendStatus(404);
      } catch (error) {
        return res.sendStatus(500);
      }
    })
  .post(
    passport.authenticate('bearer'),
    projectAccessCheck,
    async(req, res) => {
      try {
        const targetUser = await getUser(req.body.email);
        if (!targetUser) {
          return res.sendStatus(400);
        }
        const role = await getProjectRole(req.params.id, targetUser.id);
        if (role) {
          return res.sendStatus(409);
        }
        await addUserToProject(req.params.id, targetUser.id);
        return res.send({
          id: targetUser.id,
          email: req.body.email,
          user_role: ROLE_MEMBER,
        });
      } catch (error) {
        return res.sendStatus(500);
      }
    });

router
  .route('/project/:id/member/:mid')
  .delete(
    passport.authenticate('bearer'),
    projectAccessCheck,
    async(req, res) => {
      try {
        let role = ROLE_MEMBER;
        if (req.params.mid !== req.user.id) {
          role = await getProjectRole(req.params.id, req.user.id);
        }
        if (role !== ROLE_ADMIN) {
          return res.sendStatus(401);
        }
        const targetUserRole = await getProjectRole(req.params.id, req.params.mid);
        if (!targetUserRole) {
          return res.sendStatus(400);
        }
        const success = await removeUserFromProject(req.params.id, req.params.mid);
        if (!success) {
          return res.sendStatus(400);
        }
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(500);
      }
    });

router
  .route('/project/:id/notification/slack')
  .get(
    passport.authenticate('bearer'),
    projectAccessCheck,
    async(req, res) => {
      try {
        const slackData = await getSlackIntegrationData(req.params.id);
        if (slackData) {
          return res.send(slackData);
        }
        return res.sendStatus(404);
      } catch (error) {
        return res.sendStatus(500);
      }
    })
  .delete(
    passport.authenticate('bearer'),
    projectAccessCheck,
    async(req, res) => {
      try {
        const success = await removeSlackIntegrationFromProject(req.params.id, req.user.id);
        if (!success) {
          return res.sendStatus(401);
        }
        return res.sendStatus(200);
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
