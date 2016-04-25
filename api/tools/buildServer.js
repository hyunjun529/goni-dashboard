/* eslint no-console: 0 */
import webpack from 'webpack';
import {
  webpackServer,
  stats,
} from './webpack.config';

const bundler = webpack(webpackServer);
bundler.run((err, res) => {
  if (err) {
    console.log('ERR_');
  }
  console.log(res.toString(stats));
});
