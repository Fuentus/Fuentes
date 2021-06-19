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
 * Test the /SIGNUP USER
 */
describe("/SIGNUP USER", () => {
  it("it should SIGNUP USER", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/signup")
      .send({"email":"ravi_user@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
        .request(server)
        .set('Authorization','Bearer '+token)
        .post({
            "email":"ravi_user@r.com",
            "password":"12345",
            "name":"ravi"
        })
        .end((err, res) => {
          const data = res.body;
          res.should.have.status(201);
          res.body.should.be.a("object");
          // expect(res.status).to.equal(201);
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
      .send({"email":"ravi_user@r.com","password":"12345"})
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
          res.should.have.status(201);
          res.body.should.be.a("object");
          // expect(res.status).to.equal(200);
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
      .send({"email":"ravi_admin@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
        .request(server)
        .set('Authorization','Bearer '+token)
        .post({
            "email":"ravi_admin@r.com",
            "password":"12345",
            "name":"ravi"
        })
        .end((err, res) => {
          const data = res.body;
          res.should.have.status(201);
          res.body.should.be.a("object");
          // expect(res.status).to.equal(201);
          done();
        });
    })
});
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
      .send({"email":"ravi_admin@r.com","password":"12345"})
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
          res.should.have.status(201);
          res.body.should.be.a("object");
          // expect(res.status).to.equal(200);
          done();
        });
    })
});
});


/*
 * Test the /GET All Quotes : Admin
 */
describe("/GET All Quotes", () => {
  it("it should GET all the quotes", (done) => {
    setTimeout(done, 300);
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

/*
 * Test the /GET Quote By Id : Admin
 */
describe("/GET A QUOTE", () => {
  it("it should GET all the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/ + quote.id")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /POST Quote : Admin
 */
describe("/POST QUOTE", () => {
  it("it should POST the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
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
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /PUT Quote : Admin
 */
describe("/PUT QUOTE", () => {
  it("it should EDIT the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/ + quotes.id")
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
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /DELETE Quote : Admin
 */
describe("/DELETE A QUOTE", () => {
  it("it should DELETE the quote by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/ + quote.id")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /CHANGE STATUS Quote : Admin
 */
describe("/CHANGE STATUS QUOTE", () => {
  it("it should CHANGE STATUS of the quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_admin@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/ + quote.id")
         .set('Authorization', 'Bearer ' +token)
         .send({"status":"COMPLETED"})
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})


/*
 * Test the /GET All Quotes : User
 */
describe("/GET All Quotes", () => {
  it("it should GET all the quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_user@r.com","password":"12345"})
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

/*
 * Test the /GET Quote By Id : User
 */
describe("/GET A QUOTE", () => {
  it("it should GET all the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_user@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/ + quote.id")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /POST Quote : User
 */
describe("/POST QUOTE", () => {
  it("it should POST the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_user@r.com","password":"12345"})
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
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /PUT Quote : User
 */
describe("/PUT QUOTE", () => {
  it("it should EDIT the quotes by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_user@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/ + quotes.id")
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
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})

/*
 * Test the /DELETE Quote : User
 */
describe("/DELETE A QUOTE", () => {
  it("it should DELETE the quote by id", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email":"ravi_user@r.com","password":"12345"})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/ + quote.id")
         .set('Authorization', 'Bearer ' +token)
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(data.totalItems).to.deep.equal(data.quotes.length);
           done();
         })
      })
  })
})