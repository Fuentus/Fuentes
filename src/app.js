const morgan = require('morgan');
const compression = require('compression');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const multer = require('multer');
const helmet = require('helmet');
const uuid = require('node-uuid')
const db = require('./models');
const logger = require('./util/log_utils')
const app = express()

morgan.token('id', function getId(req) {
    return req.id
})

function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}

app.use(cors())
app.use(assignId)
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: logger.stream}));

app.use(bodyParser.json());

const userRoutes = require('./routes/user/index.js');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/index.js');
const workerRoutes = require('./routes/worker/worker');
const AdminUser = require('./middleware/admin-user');
const isAuth = require("./middleware/is-auth");
app.use('/auth', authRoutes);
app.use('/worker', workerRoutes);
app.use('/admin', [isAuth, AdminUser], adminRoutes);
app.use('/', userRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const {message, data} = error;
    const {originalUrl, method, ip} = req;
    // add this line to include winston logging
    logger.error(`${status} - ${message} - ${originalUrl} - ${method} - ${ip}`);

    res.status(status).json({message: message, data: data});
});
// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
    logger.error('There was an unhandledRejection', reason)
    throw reason;
});
process.on('uncaughtException', err => {
    logger.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
})
const PORT = process.env.PORT || 3000;
var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
}
if (cluster.isWorker) {
    db.sequelize
        .sync().then(() => {
        app.listen(PORT, () => {
            console.log('running')
        })
    }).catch(err => {
        console.log(err);
    });
}

module.exports = app;
