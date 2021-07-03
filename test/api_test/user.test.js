const assert = require("assert");
const quoteController = require("../../src/controllers/quote");
const auth = require('../api_test/user.test.js')
const { adminEmail, adminPassword, userEmail, userPassword, incorrectEmail, incorrectPassword } = require('../api_test/creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/*
 * Test the /SIGNUP USER
 */
describe("/SIGNUP USER", () => {
  it("it should SIGNUP USER", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/signup")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const data = res.body;
          res.should.have.status(201);
          res.body.should.be.a("object");
          expect(res.status).to.equal(201);
          done();
        })
    })
    it("it should return VALIDATION error for duplicate USER", (done) => {
        setTimeout(done, 300);
        chai
          .request(server)
          .post("/auth/signup")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            chai
            .request(server)
            .send({
                "message": "Validation failed.",
                "data": [
                    {
                        "value": "ravi_user@r.com",
                        "msg": "E-Mail address already exists!",
                        "param": "email",
                        "location": "body"
                    }
                ]
            })
            .end((err, res) => {
              const data = res.body;
              res.should.have.status(422);
              res.body.should.be.a("object");
              expect(res.status).to.equal(422);
              done();
            });
        })
    });
    });
    

/*
 * Test the /LOGIN USER
 */
describe("/LOGIN USER", () => {
  it("it should LOGIN USER", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        .request(server)
        .set('Authorization','Bearer '+token)
        .post({
            "email":"ravi_user@r.com",
            "password":"12345"
        })
        .end((err, res) => {
          const data = res.body;
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.status).to.equal(200);
          done();
        });
    })
    });
    it("it should not LOGIN USER with incorrect email", (done) => {
        setTimeout(done, 300);
        chai
        .request(server)
        .post("/auth/login")
        .send({"email" : incorrectEmail, "password" : userPassword})
        .end((err,res) => {
            chai
            .request(server)
            .send({
                "message": "A user with this email could not be found."
            })
            .end((err, res) => {
            const data = res.body;
            res.should.have.status(401);
            res.body.should.be.a("object");
            expect(res.status).to.equal(401);
            done();
            });
        })
    });
});

/*
 * Test the /SIGNUP ADMIN
 */
describe("/SIGNUP ADMIN", () => {
  it("it should SIGNUP ADMIN", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/createAdmin")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const data = res.body;
          res.should.have.status(201);
          res.body.should.be.a("object");
          expect(res.status).to.equal(201);
          done();
        })
    })
});

/*
 * Test the /LOGIN ADMIN
 */
describe("/LOGIN ADMIN", () => {
  it("it should LOGIN ADMIN", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        .request(server)
        .set('Authorization','Bearer '+token)
        .post({
            "email":"ravi_admin@r.com",
            "password":"12345"
        })
        .end((err, res) => {
          const data = res.body;
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.status).to.equal(200);
          done();
        });
    })
    });
    it("it should not LOGIN ADMIN with incorrect email", (done) => {
        setTimeout(done, 300);
        chai
        .request(server)
        .post("/auth/login")
        .send({"email" : incorrectEmail, "password" : adminPassword})
        .end((err,res) => {
            chai
            .request(server)
            .send({
                "message": "A user with this email could not be found."
            })
            .end((err, res) => {
            const data = res.body;
            res.should.have.status(401);
            res.body.should.be.a("object");
            expect(res.status).to.equal(401);
            done();
            });
        })
    });
});
