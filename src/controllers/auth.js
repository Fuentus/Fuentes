const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET, JWT_SECRET_WORKER} = require("../util/config");

const {Users, Workers} = require("../models");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const role = req.user?.role;
    const phone = req.body.phone;
    const address = req.body.address;
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            const user = new Users({
                email: email,
                password: hashedPw,
                name: name,
                role: role,
                phone: phone,
                address: address
            });
            return user.save();
        })
        .then((result) => {
            res.status(201).json({message: "User created!", userId: result.id});
        });
};

exports.createAdminUser = (req, res, next) => {
    this.signup(req, res, next);
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Users.findOne({where: {email: email}})
        .then(async (user) => {
            if (!user) {
                const error = new Error("A user with this email could not be found.");
                error.statusCode = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error("Password is Incorrect.");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({email: user.email, userId: user.id,}, JWT_SECRET, {expiresIn: "24h"});
            if (user.role === "ADMIN") {
                res.status(200).json({token: token, userName: user.name, userId: user.id, admin: true})
            } else {
                res.status(200).json({token: token, userName: user.name, userId: user.id});
            }
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(err.statusCode).json({message: err.message});
        });
};

exports.workerLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Workers.findOne({where: {email: email}})
        .then(async (user) => {
            if (!user) {
                const error = new Error("Worker with this email could not be found");
                error.statusCode = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error("Password is Incorrect.");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({email: user.email, workerId: user.id,}, JWT_SECRET_WORKER, {expiresIn: "24h"});
            res.status(200).json({token: token, userId: user.id});
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(err.statusCode).json({message: err.message});
        });
};