const assert = require("assert");
const quoteController = require("../../src/controllers/quote");
const { adminEmail, adminPassword, userEmail, userPassword } = require('../api_test/creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/*
 * Test the /QUOTE SERVICES ADMIN
 */
describe("/QUOTE SERVICES ADMIN", () => {
  it("it should GET all the quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
          .request(server)
          .get("/quotes/")
          .set('Authorization','Bearer '+token)
          .end((err, res) => {
            const data = res.body;
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(data.totalItems).to.deep.equal(data.quotes.length);
            done();
          })
      })
  });
  it("it should GET all the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/1/")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should POST the quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/")
         .set('Authorization', 'Bearer ' +token)
         .send({
              "title":"test_new_1234",
              "desc":"test_new_1234",
              "measures": [
                  {
                      "name":"measure1",
                      "qty":1,
                      "unit":1
                  }
              ],
              "uploads":{
                  "fileName":"test",
                  "filePath":"reasas"
              }
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.be.a("object");
           expect(res.status).to.equal(201);
           done();
         })
      })
  })
  it("it should EDIT the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/1/")
         .set('Authorization', 'Bearer ' +token)
         .send({
              "title":"test_new_002",
              "desc":"test_new_1234",
              "measures": [
                  {
                      "name":"measure1",
                      "qty":1,
                      "unit":1
                  }
              ],
              "uploads":{
                  "fileName":"test",
                  "filePath":"reasas"
              }
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.be.a("object");
           expect(res.status).to.equal(201);
           done();
         })
      })
  })
  it("it should DELETE the quote by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/1/")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should SEARCH for a quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/search/")
         .set('Authorization', 'Bearer ' +token)
         .send({"search":"title"})
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
  it("it should CHANGE STATUS of the quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/1/")
         .set('Authorization', 'Bearer ' +token)
         .send({"status":"COMPLETED"})
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.be.a("object");
           expect(res.status).to.equal(201);
           done();
         })
      })
  })
});


/*
 * Test the /QUOTE SERVICES USER
 */
describe("/QUOTE SERVICES USER", () => {
  it("it should GET all the quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
          .request(server)
          .get("/quotes/")
          .set('Authorization','Bearer '+token)
          .end((err, res) => {
            const data = res.body;
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(data.totalItems).to.deep.equal(data.quotes.length);
            done();
          })
      })
  });
  it("it should GET the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/2/")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should POST the quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/")
         .set('Authorization', 'Bearer ' +token)
         .send({
              "title":"test_new_1234",
              "desc":"test_new_1234",
              "measures": [
                  {
                      "name":"measure1",
                      "qty":1,
                      "unit":1
                  }
              ],
              "uploads":{
                  "fileName":"test",
                  "filePath":"reasas"
              }
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.be.a("object");
           expect(res.status).to.equal(201);
           done();
         })
      })
  })
  it("it should EDIT the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/2/")
         .set('Authorization', 'Bearer ' +token)
         .send({
              "title":"test_new_002",
              "desc":"test_new_1234",
              "measures": [
                  {
                      "name":"measure1",
                      "qty":1,
                      "unit":1
                  }
              ],
              "uploads":{
                  "fileName":"test",
                  "filePath":"reasas"
              }
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.be.a("object");
           expect(res.status).to.equal(201);
           done();
         })
      })
  })
  it("it should DELETE the quote by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/2/")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(20);
           done();
         })
      })
  })
  it("it should SEARCH for a quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/search/")
         .set('Authorization', 'Bearer ' +token)
         .send({"search":"title"})
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
});