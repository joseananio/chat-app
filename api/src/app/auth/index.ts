import { Express } from 'express';
import jwt from 'express-jwt';
import jwks from 'jwt-rsa';

export const authService = (app: Express) => {
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-manga.us.auth0.com/.well-known/jwks.json',
    }),
    audience: 'http://localhost:3001',
    issuer: 'https://dev-manga.us.auth0.com/',
    algorithms: ['RS256'],
  });

  app.use(jwtCheck);

  app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
  });
};
