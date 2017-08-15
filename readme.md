#crud-o-matic

CURD generator targeting at frontend: angular es6 & bootstrap. backend: express & mongoose.

# Frontend

Angular ES6 / Bootstrap.

It requires many modules, including some I personaly use in my seed project:
[llafuente/angular-es6-stack](https://github.com/llafuente/angular-es6-stack)
It's better to bootstrap the angular side with it.

# Backend

Server side is self-contained in the generated files, but it requires the
generator to create mongoose schema/models. This will be solved soon
and server side will be 100% self-contained after generation.

# TODO

* pupolate query list
* add JS con list.controller.js based on filters
* fulltext search
* search $in array-of-strings


# dev (windows)

```
md C:\data\db
& "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath C:\data\db

& 'C:\Program Files\MongoDB\Server\3.4\bin\mongo.exe'
use test
db.createCollection("test")
```

```
cd C:\Users\llafuente-pc\Documents\GitHub\crud-o-matic
cd generated\server
npm start
```

```
cd C:\Users\llafuente-pc\Documents\GitHub\crud-o-matic
cd angular
npm start
```

TODO

$ npm install body-parser --save
$ npm install cookie-parser --save
$ npm install morgan --save
$ npm install errorhandler --save
$ npm install method-override --save
$ npm install @types/body-parser --save-dev
$ npm install @types/cookie-parser --save-dev
$ npm install @types/morgan --save-dev
$ npm install @types/errorhandler --save-dev
$ npm install @types/method-override --save-dev
