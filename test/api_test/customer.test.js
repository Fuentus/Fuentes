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
 * Test the /customer SERVICES
 */
describe("/customer SERVICES", () => {
  it("it should GET all the customer", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        chai
            .request(server)
            .get("/admin/customer")
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });

  it("it should GET ONE customer", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 9;
        chai
            .request(server)
            .get("/admin/customer/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("id").eq(id)
                done();
            })
      })
  });


  it("it should UPDATE CUSTOMER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 12;
        chai
            .request(server)
            .put("/admin/customer/" + id)
            .set('Authorization','Bearer '+token)
            .send({
                "name": "ali",
                "email": "ss@gmail.com",
                "phone" : "3456789098765",
                "address" : "test address"
            })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq('Updated Customer')
                done();
            })
      })
  });

  it("it should DELETE CUSTOMER", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 22;
        chai
            .request(server)
            .delete("/admin/customer/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq("User Deleted Successfully")
                done();
            })
      })
  });

  it("it should not DELETE CUSTOMER if he has any quotes", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 5;
        chai
            .request(server)
            .delete("/admin/customer/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.text.should.be.eq("Customer cannot be deleted as Some Quote belongs to customer")
                done();
            })
      })
  });
});

describe("/customer SERVICES : USER", () => {
    it("it should UPDATE CUSTOMER", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : "t@g.com", "password" : "12345"})
          .end((err,res) => {
            const {token} = res.body;
            chai
                .request(server)
                .put("/user")
                .set('Authorization','Bearer '+token)
                .send({
                    "name": "updated",
                    "email": "1213@gmail.com",
                    "phone" : "3456789098765",
                    "address" : "test address"
                })
                .end((err, res) => {
                    const data = res.body;
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq('Updated')
                    done();
                })
          })
      });
})