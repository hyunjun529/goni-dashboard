import {
  Router,
} from 'express';

const router = Router();

router
  .route('/aws/health')
  .get(
    async(req, res) => {
      return res.sendStatus(200);
    }
  );

export default router;
