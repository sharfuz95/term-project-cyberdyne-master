/* eslint-disable no-console, no-new */

/* === Module Imports === */

// ExpressJS Web Server
import express from 'express';

import bodyParser from 'body-parser';

import cors from 'cors';

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';

import { SubscriptionServer } from 'subscriptions-transport-ws';

// High-precision timing, so we can debug response time to serve a request
// import ms from 'microseconds';

// Chalk terminal library
import chalk from 'chalk';

// Node.js implementation of the JSON Web Token standard
import jwt from 'jsonwebtoken';

// import expressJwt from 'express-jwt';

// import jwks from 'jwks-rsa';

import { execute, subscribe } from 'graphql';

/* === End Module Imports === */

/* === Local Imports === */

// Console logging messages
import { logServerStarted } from './utils/console';

import { refreshTokens } from './api/auth';

import schema from './api/schema';

import models from './api/models';

import secret from '../secret';

import { contributors, logo } from './utils/banner';

/* === End Local Imports === */

/* Server application instance */

// Host, port, and application secret key -- from the environment
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const SECRET = secret;

const app = express();

/**
 * Auth0 integration for ExpressJS. This is a middleware pipeline that checks the signature
 * of a JSON Web Token (JWT). Needs testing
 */
// const jwtCheck = expressJwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://cyberdyne-ur.auth0.com/.well-known/jwks.json',
//   }),
//   audience: 'https://cyberdyne-ur.io/api',
//   issuer: 'https://cyberdyne-ur.auth0.com/',
//   algorithms: ['RS256'],
// });

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(cors('*'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

/**
 * Adds the JWT signature-checking middleware to the middleware pipeline used by Express.
 * Needs testing.
 */
// app.use(jwtCheck);

// app.get('/authorized', (req, res) => {
//   res.send('Secured Resource');
// });

app.use(addUser);

// Express route handlers
// Set-up a general purpose /ping route to check the server is alive
app.use('/ping', async res => {
  res.send('pong');
});

// Favicon.ico.  By default, we'll serve this as a 204 No Content.
// If /favicon.ico is available as a static file, it'll try that first
/*
app.use('/favicon.ico', async res => {
  await res.status(204).send('No favicon');
});
*/

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      SECRET,
      user: req.user,
    },
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:3000/subscriptions',
  }),
);

/*
app.use(async (res, next) => {
  const start = ms.now();
  await next();
  const end = ms.parse(ms.since(start));
  const total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
  res.set('X-Response-Time', `${total / 1e3}ms`);
});
*/

const syncOpts = {
  logging: false,
  force: false,
  match: /_dev$/,
};

models.sequelize.sync(syncOpts).then(() =>
  app.listen({ host: HOST, port: PORT }, () => {
    console.log(`

    ${logo}

    ${contributors}

    `);
    logServerStarted({
      type: 'Cyberdyne',
      host: HOST,
      port: PORT,
      chalk: chalk.bgYellow.black,
    });
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: app,
        path: '/subscriptions',
      },
    );
  }),
);
