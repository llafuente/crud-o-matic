// TODO
// list need the schema
// that's very inconvenient, maybe in the future I can generate
// all that list needs, but it's easier this way atm
// there is some TODO code...
/* eslint-disable no-unreachable*/

// sent for consistency
let generator; // eslint-disable-line no-unused-vars
let schema;

module.exports = function(_gen, _sch) {
  generator = _gen;
  schema = _sch;
};


module.exports.listQuery = listQuery;
module.exports.middleware = middleware;
module.exports.csvListQuery = csvListQuery;
module.exports.xmlListQuery = xmlListQuery;
module.exports.jsonListQuery = jsonListQuery;

const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const csvWriter = require('csv-write-stream');
const jsontoxml = require('jsontoxml');

function typeCanBePopulated(type) {
  if ('function' === typeof type) {
    return 'ObjectId' !== type.schemaName;
  }

  if (Array.isArray(type) && type.length === 1) {
    type = type[0];
    if ('function' === typeof type) {
      return 'ObjectId' !== type.schemaName;
    }
  }

  return false;
}

function listQuery(user, where, sort, limit, offset, populate, next) {
  let query = mongoose.models.<%= schema.getName() %>.find({});
  let qcount = (query.toConstructor())().count();
  let path;

  if ('string' === typeof where) {
    try {
      where = JSON.parse(where);
    } catch (_) {
      err = new ValidationError(null);
      err.errors.offset = {
        path: 'query:where',
        message: 'invalid where',
        type: 'invalid-where',
        value: where,
        value_type: 'json_string',
      };
      return next(err);
    }
  } else if ('object' === typeof where) {
    where = where;
  } else {
    where = {};
  }

  // TODO HACK review this '$' -> '.'
  Object.keys(where).forEach(function(k) {
    if (k.indexOf('$') !== -1) {
      where[k.replace(/\$/g, '.')] = where[k];
      delete where[k];
    }
  });
  $log.debug(where);

  sort = sort || '_id';
  limit = limit ? parseInt(limit, 10) : 0;
  offset = offset ? parseInt(offset, 10) : 0;
  populate = populate || [];
  let err;

  if (isNaN(offset)) {
    err = new ValidationError(null);
    err.errors.offset = {
      path: 'query:offset',
      message: 'offset must be a number',
      type: 'invalid-offset',
      value: offset,
      value_type: 'number',
    };
    return next(err);
  }

  if (offset) {
    query.skip(offset);
  }

  if (isNaN(limit)) {
    err = new ValidationError(null);
    err.errors.limit = {
      path: 'query:limit',
      message: 'limit must be a number',
      type: 'invalid-limit',
      value: limit,
      value_type: 'number',
    };
    return next(err);
  }


  if (limit) {
    query.limit(limit);
  }
  // http://mongoosejs.com/docs/api.html#query_Query-sort
  // validate sort
  const ss = sort.split(' ');
  for (let i = 0; i < ss.length; ++i) {
    path = ss[i][0] === '-' ? ss[i].substring(1) : ss[i];
    const options = schema.mongooseSchema.path(path);
    if (!options) {
      err = new ValidationError(null);
      err.errors.sort = {
        path: 'query:sort',
        message: 'not found in schema',
        type: 'invalid-sort',
        value: path,
        value_type: 'string',
      };
      return next(err);
    }

    if (schema.isPathRestricted(path, 'read', user)) {
      err = new ValidationError(null);
      err.errors.sort = {
        path: 'query:sort',
        message: 'field is restricted',
        type: 'invalid-sort',
        value: path,
        value_type: 'string',
      };
      return next(err);
    }
  }

  query.sort(sort);

  // populate
  if (!Array.isArray(populate)) {
    err = new ValidationError(null);
    err.errors.populate = {
      path: 'query:populate',
      message: 'is not an array',
      type: 'invalid-populate',
      value: populate,
    };
    return next(err);
  }

  for (let i = 0; i < populate.length; ++i) {
    path = populate[i];
    const options = schema.mongooseSchema.path(path);
    if (!options) {
      err = new ValidationError(null);
      err.errors.populate = {
        path: 'query:populate',
        message: 'not found in schema',
        type: 'invalid-populate',
        value: path,
      };
      return next(err);
    }

    if (!typeCanBePopulated(options.options.type)) {
      err = new ValidationError(null);
      err.errors.populate = {
        path: 'query:populate',
        message: 'field cannot be populated',
        type: 'invalid-populate',
        value: path,
      };
      return next(err);
    }

    if (schema.isPathRestricted(path, 'read', user)) {
      err = new ValidationError(null);
      err.errors.populate = {
        path: 'query:populate',
        message: 'field is restricted',
        type: 'invalid-populate',
        value: path,
      };
      return next(err);
    }

    query.populate(path);
  }

  // where
  for (path in where) { // eslint-disable-line guard-for-in
    const options = schema.mongooseSchema.path(path);
    if (!options) {
      err = new ValidationError(null);
      err.errors.populate = {
        path: 'query:where',
        message: 'not found in schema',
        type: 'invalid-where',
        value: path,
      };
      return next(err);
    }
    query = query.where(path).equals(where[path]);
    qcount = qcount.where(path).equals(where[path]);
  }

  return next(null, query, qcount, limit, offset);
}

function middleware(req, res, next) {
    $log.silly('listQueryBuilder');
    listQuery(
      req.user,

      req.query.where,
      req.query.sort,
      req.query.limit,
      req.query.offset,
      req.query.populate,

      function buildQueryOk(err, query, qcount, limit, offset) {
        if (err) {
          return next(err);
        }

        $log.silly('buildQueryOk');
        req.list = {
          query: query,
          qcount: qcount,
          limit: limit,
          offset: offset,
        };

        return next();
      }
    );
  }

function jsonListQuery(storeAt) {
  return function(req, res, next) {
    $log.silly('jsonListQuery');
    req.list.query.exec(function(err, mlist) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      return req.list.qcount.exec(function(err2, count) {
        /* istanbul ignore next */ if (err2) {
          return next(err2);
        }

        req[storeAt] = {
          count: count,
          offset: req.list.offset,
          limit: req.list.limit,
          list: mlist
        };

        return next();
      });
    });
  };
}
// TODO labels
function csvListQuery(req, res, next) {
  $log.silly('Headers: Accept' + req.headers.accept);
  //example: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
  if (req.headers.accept && req.headers.accept.indexOf('text/csv') !== -1) {
    res.set('content-type', 'text/csv; charset=utf-8');
    // TODO doc: strict means exactly current page!
    if (!req.query.strict) {
      req.list.query.limit(0);
      req.list.query.skip(0);
    }
    req.list.query.lean(true);

    let newline = '\n';
    switch (req.query.newline) {
    case 'win': newline = '\r\n'; break;
    case 'linux': newline = '\n'; break;
    case 'max': newline = '\r'; break;
    }

    const writer = csvWriter({
      sendHeaders: true,
      separator: req.query.separator || ',',
      newline: newline
    });
    writer.pipe(res);

    return req.list.query
    .stream()
    .on('data', function(d) {
      //TODO
      throw new Error('todo');

      formatter(req, d, function(err, fd) {
        writer.write(fd);
      });
    })
    .on('error', function() {
      writer.end();
    })
    .on('close', function() {
      writer.end();
    });
  }

  return next();
}

//TODO FIXME XML - array issues
// use: arrayMap: {nicknames: 'name'}
function xmlListQuery(req, res, next) {
  $log.silly('xmlListQuery');
  if (req.headers.accept && req.headers.accept.indexOf('text/xml') !== -1) {
    res.set('content-type', 'text/xml; charset=utf-8');
    // TODO doc: strict means exactly current page!
    if (!req.query.strict) {
      req.list.query.limit(0);
      req.list.query.skip(0);
    }
    req.list.query.lean(true);

    res.write(`<${schema.getPlural()}>`);
    return req.list.query
    .stream()
    .on('data', function(d) {
      // TODO
      throw new Error('todo');

      formatter(req, d, function(err, fd) {
        const obj = {};
        // properly handled id as string
        obj[schema.getName()] = JSON.parse(JSON.stringify(fd));

        res.write(jsontoxml (obj, {
          escape:true,
          //xmlHeader: true,
          prettyPrint: true,
          indent: ' '
        }));

        res.write('\n');
      });
    })
    .on('error', function() {
      res.write(`</${schema.getPlural()}>`);
      res.end();
    })
    .on('close', function() {
      res.write(`</${schema.getPlural()}>`);
      res.end();
    });
  }

  return next();
}

// TODO
function formatter() {

}
