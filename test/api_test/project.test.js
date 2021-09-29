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
 * Test the /OPERATIONS SERVICES
 */
describe("/PROJECTS SERVICES", () => {
  it("it should GET all the PROJECTS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .get("/admin/project")
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET ONE PROJECT", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 54;
        chai
            .request(server)
            .get("/admin/project/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("id").eq(id)
                done();
            })
      })
  });

  it("it should UPDATE PROJECT", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 12;
        chai
            .request(server)
            .put("/admin/project/" + id)
            .set('Authorization','Bearer '+token)
            .send({
                "name":"project 54",
                "desc":"project",
                "startDate":"2022-09-02",
                "endDate":"2022-09-29",
                "workers": [
                    {
                        "id": 124,
                        "required_hrs": 1
                    }
                ]
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq('Worker added to Project')
                done();
            })
      })
  });

  it("it should NOT UPDATE a NON-EXISTING PROJECT", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 122;
        chai
            .request(server)
            .put("/admin/project/" + id)
            .set('Authorization','Bearer '+token)
            .send({
                "name":"project 54",
                "desc":"project",
                "startDate":"2022-09-02",
                "endDate":"2022-09-29",
                "workers": [
                    {
                        "id": 124,
                        "required_hrs": 1
                    }
                ]
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.body.should.have.property("message").eq('Project Doesnot Exists')
                done();
            })
      })
  });

  it("it should NOT UPDATE PROJECT with invalid workers", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 53;
        chai
            .request(server)
            .put("/admin/project/" + id)
            .set('Authorization','Bearer '+token)
            .send({
                "name":"project 54",
                "desc":"project",
                "startDate":"2022-09-02",
                "endDate":"2022-09-29",
                "workers": [
                    {
                        "id": 124222222,
                        "required_hrs": 1
                    },
                    {
                        "id": 1242222212,
                        "required_hrs": 1
                    }
                ]
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(500);
                res.body.should.have.property("message").eq("Please try back Later")
                done();
            })
      })
  });

  it("it should CHANGE PROJECT STATUS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 53;
        chai
            .request(server)
            .post("/admin/project/changeStatus/" + id)
            .send({"note" : "GOOD"})
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });
});