const morgan = require('morgan');
const compression = require('compression');

const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const helmet = require('helmet');
const uuid = require('node-uuid')
const db = require('./models');
const {logger} = require('./util/log_utils')
const app = express()

morgan.token('id', function getId(req) {
    return req.id
})

function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}

app.use(assignId)
app.use(helmet());
app.use(compression());
app.use(morgan(':id :method :url :response-time'))
app.use(morgan('combined', {stream: logger.stream}));

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

const userRoutes = require('./routes/user/index.js');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/index.js');
const AdminUser = require('./middleware/admin-user');
const isAuth = require("./middleware/is-auth");
app.use('/auth', authRoutes);
app.use('/admin', [isAuth, AdminUser], adminRoutes);
app.use('/', userRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});
// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})

const PORT = process.env.PORT || 3000;
db.sequelize
    .sync().then(() => {
    app.listen(PORT, () => {
        console.log('running')
    })
}).catch(err => {
    console.log(err);
});

module.exports = app;
