const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const isAuth = require('./middleware/is-auth');
// const User = require('./models/user');

const sequelize = require('./config/db');


const measureRouter = require('./routes/measure')
const quoteRoute = require('./routes/quote');
const authRoutes = require('./routes/auth');

const User = require('./models/User');
const Measure = require('./models/Measure');
const Quote = require('./models/Quote');

const app = express()

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

app.use('/quotes', quoteRoute);
app.use(measureRouter)
app.use('/auth', authRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

Measure.belongsTo(Quote, { constraints: true, onDelete: 'CASCADE' });
Quote.hasMany(Measure);

Quote.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });
User.hasMany(Quote);

const PORT = process.env.PORT || 3000;
sequelize
  .sync().then(res => {
    app.listen(PORT, () => {
      console.log('running')
    })
  }).catch(err => {
    console.log(err);
  });