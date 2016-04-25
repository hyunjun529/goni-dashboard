/* eslint no-console: 0 */
import 'babel-polyfill';
import webpack from 'webpack';
import {
  webpackClient,
  stats,
} from './webpack.config';

const bundler = webpack(webpackClient);
bundler.run((err, res) => {
  console.log(res.toString(stats));
});
