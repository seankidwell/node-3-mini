const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const port = 1337;
const session = require('express-session');
require('dotenv').config();

const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10000
  }
}))

app.use(createInitialSession);
app.use( express.static( `${__dirname}/../build` ) );

// app.use((req, res, next) => {
//   let {method} = req;
//   if (method === 'PUT' || method === 'POST') {
//     filter(req, res, next);
//   } else {
//     next();
//   }
// })

app.post( "/api/messages", filter, mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", filter, mc.update );
app.delete( "/api/messages", mc.delete );
app.get('/api/messages/history', mc.history);


app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );