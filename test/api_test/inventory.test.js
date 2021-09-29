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
 * Test the /INVENTORY SERVICES
 */
describe("/INVENTORY SERVICES", () => {
  it("it should GET all the INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
        chai
                  .request(server)
                  .get("/admin/inventory")
                  .set('Authorization','Bearer '+token)
                  .end((err, res) => {
                    const data = res.body;
                    res.should.have.status(200);
                    done();
                  })
      })
  });

  it("it should GET ONE INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 5;
        chai
                  .request(server)
                  .get("/admin/inventory/" + id)
                  .set('Authorization','Bearer '+token)
                  .end((err, res) => {
                    const data = res.body;
                    res.should.have.status(200);
                    res.body.should.have.property("id").eq(id)
                    done();
                  })
      })
  });

  it("it should CREATE INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
                  .request(server)
                  .post("/admin/inventory/")
                  .set('Authorization','Bearer '+token)
                  .send({ "itemName": "11111", "itemDesc": " test", "availability": 250, "cost": 10, "supplier_email": "sanjith@g.com" })
                  .end((err, res) => {
                    const data = res.body;
                    res.should.have.status(201);
                    res.body.should.have.property("message").eq("Inventory created!")
                    done();
                  })
      })
  });

  it("it should not UPDATE NON-EXISTING INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 255555;
        chai
            .request(server)
            .put("/admin/inventory/" + id)
            .set('Authorization','Bearer '+token)
            .send({ "itemName": "twnrty five", "itemDesc": " 1234567", "availability": 250, "cost": 10, "supplier_email": "sanjith@g.com" })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(400);
                res.body.should.have.property("message").eq('Inventory Doesnot Exists')
                done();
            })
      })
  });

  it("it should UPDATE INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 25;
        chai
            .request(server)
            .put("/admin/inventory/" + id)
            .set('Authorization','Bearer '+token)
            .send({ "itemName": "twnrty five", "itemDesc": " 1234567", "availability": 250, "cost": 10, "supplier_email": "sanjith@g.com" })
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                res.body.should.have.property("message").eq('Inventory updated!')
                done();
            })
      })
  });

  it("it should DELETE INVENTORY", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 25;
        chai
            .request(server)
            .delete("/admin/inventory/" + id)
            .set('Authorization','Bearer '+token)
            .end((err, res) => {
                const data = res.body;
                res.should.have.status(200);
                done();
            })
      })
  });
});