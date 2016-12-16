const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const HttpError = require('<%= generatorOptions.componentsPath %>/http-error.js');
const errorHandler = require('<%= generatorOptions.componentsPath %>/error-handler.js');
// prio:
// * /users/auth, first so we can always login, even with
// and invalid session
// * jwt token validation
// * get user from database
// * the rest
module.exports = function(generator, schema) {
  const secret = '<%= config.auth.secret %>';
  const r = express.Router();

  r.post('<%= schema.apiUrls.list %>/auth', function(req, res, next) {
    generator.mongoose.models.user.findOne({
      username: req.body.username
    }, function(err, user) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      if (!user || !user.authenticate(req.body.password)) {
        return next(new HttpError(422, 'user not found or invalid pasword'));
      }

      return res.status(200).json({
        'token': jwt.sign({
          id: user._id.toString(),
          session_start: (new Date()).toString()
        }, secret)
      });
    });
  });

  //
  // jwt
  //
  r.use(expressJwt({
    secret: secret,
    credentialsRequired: false,
    // header: "Authorization: Bearer XXXXXX"
    getToken: function fromHeader(req) {
      if (req.headers.authorization) {
        const x = req.headers.authorization.split(' ');
        if (x[0] === 'Bearer') {
          return x[1];
        }
      }
      /*
      else if (req.query && req.query.access_token) {
        return req.query.access_token;
      }
      */
      return null;
    }
  }));


  r.use(function(req, res, next) {
    if (req.user && req.user.id) {
      $log.silly('regenerate session: ' + req.user.id.toString());

      return generator.mongoose.models.user
      .findOne({
        _id: req.user.id
      })
      .populate('roles')
      .exec(function(err, dbuser) {
        if (err || !dbuser) {
          return next(new HttpError(401, 'regenerate session failed'));
        }

        req.user = dbuser;
        $log.silly('user logged: ' + JSON.stringify(dbuser.toJSON()));
        next();
      });
    }
    next();
  });

  r.post('<%= schema.apiUrls.list %>/me', function(req, res, next) {
    // TODO check token
    if (!req.headers.authorization) {
      return next(new HttpError(401, 'no session'));
    }

    if (!req.user) {
      return next(new HttpError(401, 'invalid session'));
    }

    const u = req.user.toJSON();
    // TODO
    //user.$express.formatter(req, u, function(err, output) {
    //  res.status(200).json(output);
    //});

    res.status(200).json(u);
  });

  r.use(errorHandler);

  return r;
};
