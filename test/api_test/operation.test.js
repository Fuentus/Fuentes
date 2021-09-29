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
describe("/OPERATIONS SERVICES", () => {
  it("it should GET all the OPERATIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        chai
            .request(server)
            .get("/admin/operation")
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET ONE OPERATION", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 48;
        chai
            .request(server)
            .get("/admin/operation/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("id").eq(id)
                done();
            })
      })
  });

  it("it should CREATE OPERATIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .post("/admin/operation/")
            .set('Authorization','Bearer '+token)
            .send({ "name": "main test-", "desc": "Drilling Painitng", 
                "items": [
                   {
                       "id": 1,
                       "required_qty": 7
                   },{
                       "id": 2,
                       "required_qty": 50
                   }
               ],
               "workers": [
                   {
                       "id": 12,
                       "required_hrs": 30,
                       "est_cost":300
                   }
               ]
           })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(201);
                res.body.should.have.property("message").eq("Operations created!")
            done();
            })
      })
  });

  it("it should not CREATE OPERATIONS with invalid invenotry", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
            .request(server)
            .post("/admin/operation/")
            .set('Authorization','Bearer '+token)
            .send({ "name": "main test-", "desc": "Drilling Painitng", 
                "items": [
                   {
                       "id": 1111111111,
                       "required_qty": 7
                   },{
                       "id": 2111111111,
                       "required_qty": 50
                   }
               ],
               "workers": [
                   {
                       "id": 12,
                       "required_hrs": 30,
                       "est_cost":300
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

  it("it should UPDATE OPERATIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 55;
        chai
            .request(server)
            .put("/admin/operation/" + id)
            .set('Authorization','Bearer '+token)
            .send({
               "name": "testing has been test-edited",
               "desc": "Drilling Painitng",
               "items": [
                   {
                       "id": 1,
                       "required_qty": 2
                   }
               ],
               "workers": [
                   {
                       "id": 5,
                       "required_hrs": 1,
                       "est_cost":30
                   }
               ]
           })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq('Operation updated!')
                done();
            })
      })
  });

  it("it should not UPDATE NON-EXISTING OPERATIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 555555;
        chai
            .request(server)
            .put("/admin/operation/" + id)
            .set('Authorization','Bearer '+token)
            .send({
               "name": "testing has been test-edited",
               "desc": "Drilling Painitng",
               "items": [
                   {
                       "id": 1,
                       "required_qty": 2
                   }
               ],
               "workers": [
                   {
                       "id": 5,
                       "required_hrs": 1,
                       "est_cost":30
                   }
               ]
           })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.body.should.have.property("message").eq('Operation Doesnot Exists')
                done();
            })
      })
  });


  it("it should DELETE OPERATIONS", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 56;
        chai
            .request(server)
            .delete("/admin/operation/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });
});