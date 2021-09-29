const assert = require("assert");
const auth = require('../api_test/user.test.js')
const { adminEmail, adminPassword, userEmail, userPassword,memberName, incorrectEmail, incorrectPassword, workerEmail, workerPassword } = require('../api_test/creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const { response } = require("express");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);



describe('AUTH ROUTES', () => {

    
    /*
    * Test the /SIGNUP USER
    */
    describe('PUT /auth/signup', () => {
        it('It Should Create a User', done => {
            chai.request(server)
                .put('/auth/signup')
                .send({"email": "teesttt@gmail.com", "password": "userPassword", "name": "memberName"})
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.have.property("message").eq("User created!")
                done();
                })

        })
        it('It Should Validate a Duplicate User', done => {
            chai.request(server)
                .put('/auth/signup')
                .send({"email": "user1q@r.com", "password": "userPassword", "name": "memberName"})
                .end((err, response) => {
                    response.should.have.status(422);
                    response.body.should.have.property("message").eq("Validation failed.")
                done();
                })

        })
    })
    
    /*
    * Test the /LOGIN USER
    */
    describe('PUT /auth/login', () => {
        it('It Should Login a User', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": userEmail, "password": userPassword})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object")
                done();
                })
        })

        it('it should not LOGIN USER with incorrect email', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": incorrectEmail, "password": userPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("A user with this email could not be found.")
                done();
                })
        })

        it('it should not LOGIN USER with incorrect password', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": userEmail, "password": incorrectPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("Password is Incorrect.")
                done();
                })
        })
    })

    /*
    * Test the /LOGIN ADMIN
    */
    describe('PUT /auth/login', () => {
        it('It Should Login Admin', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": adminEmail, "password": adminPassword})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an("Object")
                done();
                })
        })

        it('it should not LOGIN ADMIN with incorrect email', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": incorrectEmail, "password": adminPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("A user with this email could not be found.")
                done();
                })
        })

        it('it should not LOGIN ADMIN with incorrect password', done => {
            chai.request(server)
                .post('/auth/login')
                .send({"email": adminEmail, "password": incorrectPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("Password is Incorrect.")
                done();
                })
        })
    })

     /*
    * Test the /WORKER ADMIN
    */
     describe('PUT /auth/login', () => {
        it('It Should Login Worker', done => {
            chai.request(server)
                .post('/auth/workerLogin')
                .send({"email": workerEmail, "password": workerPassword})
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an("Object")
                done();
                })
        })

        it('it should not LOGIN Worker with incorrect email', done => {
            chai.request(server)
                .post('/auth/workerLogin')
                .send({"email": incorrectEmail, "password": workerPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("Worker with this email could not be found")
                done();
                })
        })

        it('it should not LOGIN Worker with incorrect password', done => {
            chai.request(server)
                .post('/auth/workerLogin')
                .send({"email": workerEmail, "password": incorrectPassword})
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property("message").eq("Password is Incorrect.")
                done();
                })
        }) 
     })
})