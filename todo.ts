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


// TODO labels
function csvListQuery(req, res, next) {
  console.log('Headers: Accept' + req.headers.accept);
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
  console.log('xmlListQuery');
  if (req.headers.accept && req.headers.accept.indexOf('text/xml') !== -1) {
    res.set('content-type', 'text/xml; charset=utf-8');
    // TODO doc: strict means exactly current page!
    if (!req.query.strict) {
      req.list.query.limit(0);
      req.list.query.skip(0);
    }
    req.list.query.lean(true);

    res.write(`<<%= schema.getPlural() %>>`);
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
      res.write(`</<%= schema.getPlural() %>}>`);
      res.end();
    })
    .on('close', function() {
      res.write(`</<%= schema.getPlural() %>>`);
      res.end();
    });
  }

  return next();
}

// TODO
function formatter() {

}
