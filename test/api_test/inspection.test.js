const assert = require("assert");
const { adminEmail, adminPassword } = require('../api_test/creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/*
 * Test the /INSPECTION SERVICES
 */
describe("/INSPECTION SERVICES", () => {
  it("it should GET all the INSPECTIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        chai
            .request(server)
            .get("/admin/inspection")
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET ONE inspection", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 2;
        chai
            .request(server)
            .get("/admin/inspection/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should CREATE inspection", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .post("/admin/inspection/")
            .set('Authorization','Bearer '+token)
            .send({
                "name": "NEW INSPECTION",
                "cost": 123,
                "desc": "test"
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(201);
                res.body.should.have.property("message").eq('Inspections created!')
                done();
            })
      })
  });


  it("it should UPDATE inspection", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 1;
        chai
            .request(server)
            .put("/admin/inspection/" + id)
            .set('Authorization','Bearer '+token)
            .send({
                "name": "BASE",
                "cost": 0,
                "desc": "base inspection"
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(201);
                res.body.should.have.property("message").eq('Inspections updated!')
                done();
            })
      })
  });

  it("it should DELETE inspection", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 8;
        chai
            .request(server)
            .delete("/admin/inspection/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq("Inspections Deleted Successfully")
                done();
            })
      })
  });
});