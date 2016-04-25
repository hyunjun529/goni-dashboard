/* eslint object-curly-spacing:0, curly:0, comma-dangle:0, no-unused-vars:0 */
// API
import api from 'api';

// Express
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

// React
import React from 'react';
import {renderToString} from 'react-dom/server';

// React Router
import {createMemoryHistory, match, RouterContext} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

// Redux
import {Provider} from 'react-redux';
import routes from 'routes';
import createStore from 'util/redux/createStore';

import history from 'history';

const app = express();
const server = app.listen(8080);

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('build'));

// Session
app.use(session({resave: false, secret: 'secret', saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// API Router (/api)
app.use('/api', api);

app.get('*', async(req, res) => {
  res.render('client');
});

export default server;
