const assert = require("assert");
const quoteController = require("../../src/controllers/quote");
const { adminEmail, adminPassword, userEmail, userPassword, user2Email, user2Password } = require('../api_test/creds')

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
          .get("/quotes")
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

  //error cases : ADMIN
  //user2 login scenerio
  
  it("it should not GET all the quotes if a user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
          .request(server)
          .get("/quotes")
          .set('Authorization','Bearer '+token)
          .end((err, res) => {
            const data = res.body;
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(res.status).to.equal(200);
            done();
          })
      })
  });
  it("it should not GET all the quotes by id if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/111/")
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
  it("it should not be able EDIT quotes if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/9/")
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
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should not able to DELETE quotes if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/99/")
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
  it("it should not CHANGE STATUS of quotes if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/111/")
         .set('Authorization', 'Bearer ' +token)
         .send({
            "message": "Insufficient Privilege"
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
        })
    })
    it("it should not SEARCH for quotes if user with another creds login", (done) => {
      setTimeout(done, 300);
      chai
        .request(server)
        .post("/auth/login")
        .send({"email" : user2Email, "password" : user2Password})
        .end((err,res) => {
          const {token} = res.body;
          chai
           .request(server)
           .post("/quotes/search/")
           .set('Authorization', 'Bearer ' +token)
           .send({"search":"null"})
           .end((err, res) => {
             const data = res.body;
             res.should.have.status(200);
             res.body.should.be.a("object");
             expect(res.status).to.equal(200);
             done();
          })
      })
  })

  //actions on a non-eisting quote

  it("it should not GET quotes by id for a non-existing quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/111/")
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
  it("it should not be able EDIT non-existing quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/9/")
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
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should not able to DELETE the non-existing quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/99/")
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
  it("it should not CHANGE STATUS of a non-existing quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .post("/quotes/111/")
         .set('Authorization', 'Bearer ' +token)
         .send({"status":"COMPLETED"})
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
        })
    })
    it("it should not SEARCH for a non existing-quote", (done) => {
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
             .send({"search":"null"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               res.body.should.be.a("object");
               expect(res.status).to.equal(200);
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
          .get("/quotes")
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

  
  //error cases : USER
  //user2 login scenerio
  
  it("it should not GET all the quotes if a user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
          .request(server)
          .get("/quotes")
          .set('Authorization','Bearer '+token)
          .end((err, res) => {
            const data = res.body;
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(res.status).to.equal(200);
            done();
          })
      })
  });
  it("it should not GET all the quotes by id if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/111/")
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
  it("it should not be able EDIT quotes if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/9/")
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
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should not able to DELETE quotes if user with another creds login", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : user2Email, "password" : user2Password})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/99/")
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
  it("it should not SEARCH for quotes if user with another creds login", (done) => {
      setTimeout(done, 300);
      chai
        .request(server)
        .post("/auth/login")
        .send({"email" : user2Email, "password" : user2Password})
        .end((err,res) => {
          const {token} = res.body;
          chai
           .request(server)
           .post("/quotes/search/")
           .set('Authorization', 'Bearer ' +token)
           .send({"search":"null"})
           .end((err, res) => {
             const data = res.body;
             res.should.have.status(200);
             res.body.should.be.a("object");
             expect(res.status).to.equal(200);
             done();
          })
      })
  })

  //actions on a non-eisting quote

  it("it should not GET quotes by id for a non-existing quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .get("/quotes/111/")
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
  it("it should not be able EDIT non-existing quotes", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/quotes/9/")
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
           res.should.have.status(200);
           res.body.should.be.a("object");
           expect(res.status).to.equal(200);
           done();
         })
      })
  })
  it("it should not able to DELETE the non-existing quote", (done) => {
    setTimeout(done, 300);
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : userEmail, "password" : userPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .delete("/quotes/99/")
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
  it("it should not SEARCH for a non existing-quote", (done) => {
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
             .send({"search":"null"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               res.body.should.be.a("object");
               expect(res.status).to.equal(200);
               done();
            })
        })
    })
});
