const assert = require("assert");
const quoteController = require("../../src/controllers/quote");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
/*
 * Test the /GET All Quotes
 */
describe("/GET All Quotes", () => {
  it("it should GET all the quotes", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
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
          });
      })
  });
});
