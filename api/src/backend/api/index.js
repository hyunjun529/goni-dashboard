import {
  Router,
} from 'express';
import * as routes from './route';

const router = Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

for (const key in routes) {
  if (routes[key]) {
    router.use(routes[key]);
  }
}

export default router;
