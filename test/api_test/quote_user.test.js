const assert = require("assert");
const auth = require('./user.test.js')
const { userEmail, userPassword } = require('./creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const { response } = require("express");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);


describe('QUOTE ROUTES: USER', () => {
  it("it should GET all the Quotes: User", (done) => {
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
                //expect(data.totalItems).to.deep.equal(data.rows.length);
                done();
              })
          })
    });

    it("it should GET Quote by id : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 1
            chai
             .request(server)
             .get("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               res.body.should.have.property("id").eq(id)
               done();
             })
          })
    })

    it("it should NOT GET Quote by id, if Id not exists : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 222
            chai
             .request(server)
             .get("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               done();
             })
          })
    })

    it("it should create a Quote : User", (done) => {
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
                    "title":"NEW test Case quote",
                    "desc":"test",
                    "measures": [
                        {
                            "name":"test Case",
                            "qty":1,
                            "unit":1
                        }
                    ],
                    "uploads":[
                        {
                            "fileName": "test Case.png",
                            "filePath": "https://fuentes-fileupload.s3-us-west-1.amazonaws.com/quote-attachments/sample.png"
                        },
                        {
                            "fileName": "test Case.png",
                            "filePath": "https://fuentes-fileupload.s3-us-west-1.amazonaws.com/quote-attachments/sample1.png"
                        }],
                    "startDate" : "2021-11-01",
                    "endDate" : "2021-11-02"
              })
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(201);
               res.body.should.have.a.property('message').eq("Quote created!")
               done();
             })
          })
    })

    it("it should not create a Quote id if some fields are missing : User", (done) => {
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
                    "title":"NEW test Case quote"
              })
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(422);
               res.body.should.have.a.property('message').eq("Validation failed")
               done();
             })
          })
    })

    it("it should edit a Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 116
            chai
             .request(server)
             .put("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .send({
                "title":"test quote edited",
                "desc":"1",
                "measures": [
                    {
                        "name":"1",
                        "qty":1,
                        "unit":4
                    }
                ]
            })
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(201);
               res.body.should.have.a.property('id').eq(id)
               done();
             })
          })
    })

    it("it should not edit another Users Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 2
            chai
             .request(server)
             .put("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .send({
                "title":"test quote edited",
                "desc":"1",
                "measures": [
                    {
                        "name":"1",
                        "qty":1,
                        "unit":4
                    }
                ]
            })
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(401);
               res.body.should.have.a.property('message').eq("Insufficient Privilege")
               done();
             })
          })
    })

    it("it should not edit a Quote whose project status can't be updated : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 4
            chai
             .request(server)
             .put("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .send({
                "title":"test quote edited",
                "desc":"1",
                "measures": [
                    {
                        "name":"1",
                        "qty":1,
                        "unit":4
                    }
                ]
            })
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(401);
               res.body.should.have.a.property('message').eq("Quote Status cant be updated")
               done();
             })
          })
    })

    // it("it should Delete a Quote : User", (done) => {
    //     chai
    //       .request(server)
    //       .post("/auth/login")
    //       .send({"email" : userEmail, "password" : userPassword})
    //       .end((err,res) => {
    //         const {token} = res.body;
    //         const id = 126
    //         chai
    //          .request(server)
    //          .delete("/quotes/" + id)
    //          .set('Authorization', 'Bearer ' +token)
    //          .end((err, res) => {
    //            const data = res.body;
    //            res.should.have.status(200);
    //            res.body.should.have.a.property('message').eq("Update Successfully")
    //            done();
    //          })
    //       })
    // })

    it("it should not Delete a non-existing Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const id = 11111
            chai
             .request(server)
             .delete("/quotes/" + id)
             .set('Authorization', 'Bearer ' +token)
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               done();
             })
          })
    })

    it("it should Search Quote : User", (done) => {
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
             .send({"search" : "test"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               done();
             })
          })
    })
    
    it("it should Change Status of Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const quoteId = 1
            chai
             .request(server)
             .post("/quotes/140/changeStatus")
             .set('Authorization', 'Bearer ' +token)
             .send({"status" : "QUOTE_ACCEPTED"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               res.body.should.have.a.property('message').eq("Update Successfully")
               done();
             })
          })
    })

    it("it should not Change wrong Status of Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            const quoteId = 1
            chai
             .request(server)
             .post("/quotes/129/changeStatus")
             .set('Authorization', 'Bearer ' +token)
             .send({"status" : "NEW"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(422);
               res.body.should.have.a.property('msg').eq("Please Choose Correct Status")
               done();
             })
          })
    })

    it("it should not Change Admin Allowed Status of Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            chai
             .request(server)
             .post("/quotes/128/changeStatus")
             .set('Authorization', 'Bearer ' +token)
             .send({"status" : "CLOSED"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(400);
               res.body.should.have.a.property('message').eq("NO PRIVILAGE")
               done();
             })
          })
    })

    it("it should Submit PO Url of Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            chai
             .request(server)
             .post("/quotes/submitPOUrl/129")
             .set('Authorization', 'Bearer ' +token)
             .send({"submit_PO" : "https://material-ui.com/components/tables/#table"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(200);
               res.body.should.have.a.property('message').eq("PO Link & Status Updated Successfully")
               done();
             })
          })
    })

    it("it should not Submit PO Url of an Invalid Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            chai
             .request(server)
             .post("/quotes/submitPOUrl/129999")
             .set('Authorization', 'Bearer ' +token)
             .send({"submit_PO" : "https://material-ui.com/components/tables/#table"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(422);
               res.body.should.have.a.property('msg').eq("Invalid Quote")
               done();
             })
          })
    })


    it("it should not Submit PO Url for Admin Approved/Status Passed Quote : User", (done) => {
        chai
          .request(server)
          .post("/auth/login")
          .send({"email" : userEmail, "password" : userPassword})
          .end((err,res) => {
            const {token} = res.body;
            chai
             .request(server)
             .post("/quotes/submitPOUrl/4")
             .set('Authorization', 'Bearer ' +token)
             .send({"submit_PO" : "https://material-ui.com/components/tables/#table"})
             .end((err, res) => {
               const data = res.body;
               res.should.have.status(422);
               res.body.should.have.a.property('msg').eq("Please Choose Correct Status")
               done();
             })
          })
    })

})

