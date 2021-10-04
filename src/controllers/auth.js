const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET, JWT_SECRET_WORKER} = require("../util/config");
var generator = require('generate-password');

const {Users, Workers, password_change: PasswordChange, password_change_worker: PasswordChangeWorker } = require("../models");
const { SendGridMail } = require("../util/mail");
const { fetchCustomersByClause } = require("./service/CustomerService");
const logger = require("../util/log_utils");

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
    const password = generator.generate({
        length: 5,
        numbers: true
    });;
    console.log(password)
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
            // const msg = {
            //     to: req.body.email,
            //     from : 'subinthreestops@gmail.com',
            //     subject: 'Fuentus - Welcome',
                // text: "Kindly use the below creds to login. \r\n \r\n "+ req.body.email + password,
                // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            // }
            // SendGridMail
            //     .send(msg)
            //     .then(() => {
            //         console.log('User Creds sent to Registered Mail id')
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //     })
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


exports.forgotPassword = async(req, res, next) => {
    const email = req.body.email;
    const user = await Users.findOne({where: {email: email}})
    if (user) {
        const passChange = await PasswordChange.create({ UserId: user.id,  code: Math.floor(100000 + Math.random() * 900000) })
        
        console.log(passChange.code)

        // const msg = {
        //     to: email,
        //     from: 'subinthreestops@gmail.com',
        //     subject: 'fuentus - Password Reset',
        //     text: "Kindly use the below code change your password. \r\n \r\n " + passChange.code,
        // }
        // SendGridMail
        //     .send(msg)
        //     .then(() => {
        //         console.log('Email sent')
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })

        
        res.send({message : "Password Reset Code has been successfully sent to Registered Mail Id"}).status(200)
    } else {
        res.status(400).send({ message: 'Please Input a Valid Email'})
    }
};


exports.verifyReset = async(req, res, next) => {
    const { code, password, confirmPassword } = req.body
    if (password === confirmPassword) {
        const codeMatched = await PasswordChange.findOne({where: {code: code}})
        if (codeMatched) {
            const user = await Users.findOne({where: {id: codeMatched.UserId}})
            bcrypt
            .hash(password, 12)
            .then((hashedPw) => {
                Users.update({ password: hashedPw}, {where: {id: user.id}})
        })
            res.send({message : "Password Has Been Sucessfully Reset"}).status(200)
        } else {
            res.send({message : "Entered Code is Incorrect"}).status(400)
        }
    } else {
        res.send({message : "Password Donot Match"}).status(400)
    }
};

//Worker Forgot Password

exports.forgotPasswordWorker = async(req, res, next) => {
    const email = req.body.email;
    const worker = await Workers.findOne({where: {email: email}})
    if (worker) {
        const passChange = await PasswordChangeWorker.create({ WorkerId: worker.id, code: Math.floor(100000 + Math.random() * 900000) })
        
        console.log(passChange.code)

        // const msg = {
        //     to: email,
        //     from: 'subinthreestops@gmail.com',
        //     subject: 'fuentus - Password Reset',
        //     text: "Kindly use the below code change your password. \r\n \r\n " + passChange.code,
        // }
        // SendGridMail
        //     .send(msg)
        //     .then(() => {
        //         console.log('Email sent')
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })

        
        res.send({message : "Password Reset Code has been successfully sent to Registered Mail Id"}).status(200)
    } else {
        res.status(400).send({ message: 'Please Input a Valid Email'})
    }
};


exports.verifyResetWorker = async(req, res, next) => {
    const { code, password, confirmPassword } = req.body
    if (password === confirmPassword) {
        const codeMatched = await PasswordChangeWorker.findOne({where: {code: code}})
        if (codeMatched) {
            const worker = await Workers.findOne({where: {id: codeMatched.WorkerId}})
            bcrypt
            .hash(password, 12)
            .then((hashedPw) => {
                Workers.update({ password: hashedPw}, {where: {id: worker.id}})
        })
            res.send({message : "Password Has Been Sucessfully Reset"}).status(200)
        } else {
            res.send({message : "Entered Code is Incorrect"}).status(400)
        }
    } else {
        res.send({message : "Password Donot Match"}).status(400)
    }
};