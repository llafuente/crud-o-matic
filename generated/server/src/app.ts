import * as express from "express";
import * as bodyParser from "body-parser";
const cors = require('cors');


import routerUser from './users/routerUser';


const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set('debug', true);

mongoose.connect("mongodb://127.0.0.1:27017/test", {
  promiseLibrary: require("bluebird"),
  useMongoClient: true,
}, function(err) {
  if (err) {
    throw err;
  }

  console.log("connected to mongodb");
});

const app = express();

app.use(cors())

//use json form parser middlware
app.use(bodyParser.json());

//use query string parser middlware
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(routerUser);



app.use((req, res, next) => {
  res.status(404).json({error: true});
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).json({error: true});
});


if (process.env.NODE_ENV !== "test") {
  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3004;
  console.log("listening at: 0.0.0.0:" + port);
  app.listen(port, "0.0.0.0");
}
