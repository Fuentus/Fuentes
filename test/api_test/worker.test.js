const assert = require("assert");
const { adminEmail, adminPassword, workerPassword, workerEmail } = require('../api_test/creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/*
 * Test the /WORKER SERVICES
 */
describe("/WORKER SERVICES : ADMIN", () => {
  it("it should GET all WORKERS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        chai
            .request(server)
            .get("/admin/workers")
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET all WORKERS by Profession", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const professionId = 1
        chai
        chai
            .request(server)
            .get("/admin/workers/profession/" + professionId)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET ONE WORKER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 5;
        chai
            .request(server)
            .get("/admin/workers/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("id").eq(id)
                done();
            })
      })
  });

  it("it should CREATE WORKER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .post("/admin/workers/")
            .set('Authorization','Bearer '+token)
            .send({   
                "name": "twleve",
                "phone": "1231231456",
                "address": "add",
                "email": "w1@r.com",
                "avail_per_day": 8,
                "cost_per_hr": 10,
                "total_avail_per_week": 5,
                "professionId":1
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq("Created Worker")
            done();
            })
      })
  });

  it("it should NOT CREATE WORKER WITH DUPLICATE EMAIL FIELD", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .post("/admin/workers/")
            .set('Authorization','Bearer '+token)
            .send({   
                "name": "twleve",
                "phone": "1231231456",
                "address": "add",
                "email": "12@r.com",
                "avail_per_day": 8,
                "cost_per_hr": 10,
                "total_avail_per_week": 5,
                "professionId":1
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(422);
                res.body.should.have.property("message").eq("Validation failed")
            done();
            })
      })
  });

  it("it should UPDATE WORKER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 10;
        chai
            .request(server)
            .put("/admin/workers/" + id)
            .set('Authorization','Bearer '+token)
            .send({  
                "name": "ten w",
                "phone": "123",
                "address": "add",
                "email": "121212121@r.com",
                "avail_per_day": 8,
                "cost_per_hr": 10,
                "total_avail_per_week": 5,
                "professionId":2
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq("Updated Worker")
                done();
            })
      })
  });

  it("it should NOT UPDATE NON-EXISTING WORKER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 10000;
        chai
            .request(server)
            .put("/admin/workers/" + id)
            .set('Authorization','Bearer '+token)
            .send({  
                "name": "ten w",
                "phone": "123",
                "address": "add",
                "email": "121212121@r.com",
                "avail_per_day": 8,
                "cost_per_hr": 10,
                "total_avail_per_week": 5,
                "professionId":2
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.body.should.have.property("message").eq('Worker Doesnot Exists')
                done();
            })
      })
  });

  it("it should DELETE WORKER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 1111;
        chai
            .request(server)
            .delete("/admin/workers/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });


  it("it should NOT DELETE WORKER IF WORKER IS ASSIGNED TO SOME QUOTES", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 3;
        chai
            .request(server)
            .delete("/admin/workers/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.text.should.be.eq('Worker cannot be deleted as worker is assigned in Quote 2b0dcd02-21c1-4924-80e1-7838e8f61ac9')
                done();
            })
      })
  });
});

describe("/WORKER SERVICES : WORKER", () => {
    it("it should GET ONE WORKER", (done) => {
        chai
          .request(server)
          .post("/auth/workerLogin")
          .send({"email" : workerEmail, "password" : workerPassword})
          .end((err,res) => {
            const {token} = res.body;
            chai
                .request(server)
                .get("/worker/profile")
                .set('Authorization','Bearer '+token)
                .end((err, res) => {
                    const data = res.body;
                    res.should.have.status(200);
                    done();
                })
          })
      });

      it("it should UPDATE WORKER", (done) => {
            chai
              .request(server)
              .post("/auth/workerLogin")
              .send({"email" : workerEmail, "password" : workerPassword})
              .end((err,res) => {
                const {token} = res.body;
                chai
                    .request(server)
                    .put("/worker/")
                    .set('Authorization','Bearer '+token)
                    .send({  
                        "name": "Worker 123 w",
                        "phone": "123",
                        "address": "add",
                        "avail_per_day": 8,
                        "cost_per_hr": 10,
                        "total_avail_per_week": 5,
                        "professionId":2
                    })
                    .end((err, res) => {
                        const data = res.body;
                        res.should.have.status(200);
                        res.body.should.have.property("message").eq("Updated Worker")
                        done();
                    })
              })
          });
})