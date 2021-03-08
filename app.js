const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const uuid = require('node-uuid')

const db = require('./models');


const quoteRoute = require('./routes/quote');
const authRoutes = require('./routes/auth');
const inventoryRoute = require('./routes/inventory')
const operationRoute = require('./routes/operations')
const projectRoute = require('./routes/project')

const app = express()

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

morgan.token('id', function getId (req) {
  return req.id
})


app.use(assignId)
app.use(helmet());
app.use(morgan(':id :method :url :response-time'))
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/quotes', quoteRoute);
app.use('/auth', authRoutes);

//admin
app.use('/inventory', inventoryRoute)
app.use('/operations', operationRoute)
app.use('/projects', projectRoute)

function assignId (req, res, next) {
  req.id = uuid.v4()
  next()
}

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;
db.sequelize
  .sync().then(res => {
    app.listen(PORT, () => {
      console.log('running')
    })
  }).catch(err => {
    console.log(err);
  });