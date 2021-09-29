const assert = require("assert");
const auth = require('./user.test.js')
const { adminEmail, adminPassword } = require('./creds')

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app");
const { response } = require("express");
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

  describe('ADMIN /quotes/admin', () => {
      it("it should GET all the Quotes: Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
                .request(server)
                .get("/admin/quotes")
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

      it("it should GET Quote by id : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              const id = 2
              chai
               .request(server)
               .get("/admin/quotes/" + id)
               .set('Authorization', 'Bearer ' +token)
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 res.body.should.have.property("id").eq(id)
                 expect(res.status).to.equal(200);
                 done();
               })
            })
      })

      it("it should NOT GET Quote by id : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              const id = 222
              chai
               .request(server)
               .get("/admin/quotes/" + id)
               .set('Authorization', 'Bearer ' +token)
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 done();
               })
            })
      })

      it("it should Search Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/search/")
               .set('Authorization', 'Bearer ' +token)
               .send({"search" : "test"})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 done();
               })
            })
      })

      it("it should Change Status of Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              const quoteId = 1
              chai
               .request(server)
               .post("/admin/quotes/1/changeStatus")
               .set('Authorization', 'Bearer ' +token)
               .send({"status" : "WIP"})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 done();
               })
            })
      })

      it("it should not Change wrong Status of Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              const quoteId = 1
              chai
               .request(server)
               .post("/admin/quotes/4/changeStatus")
               .set('Authorization', 'Bearer ' +token)
               .send({"status" : "WIP"})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(422);
                 res.body.should.have.a.property('msg').eq("Please Choose Correct Status")
                 done();
               })
            })
      })

      it("it should not Change Customer Allowed Status of Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/6/changeStatus")
               .set('Authorization', 'Bearer ' +token)
               .send({"status" : "QUOTE_PO_SUBMIT"})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(400);
                 res.body.should.have.a.property('message').eq("ALREADY IN CUSTOMER QUEUE")
                 done();
               })
            })
      })

      it("it should Apply Tax to a Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/addTaxValue/1")
               .set('Authorization', 'Bearer ' +token)
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 res.body.should.have.a.property('message').eq("Tax Updated Successfully")
                 done();
               })
            })
      })


      it("it should Apply Inspection to a Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/assignQuoteInspection/1")
               .set('Authorization', 'Bearer ' +token)
               .send({"inspectionId": 2})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 res.body.should.have.a.property('message').eq("Inspection Added Successfully")
                 done();
               })
            })
      })

      it("it should Not Apply Inspection to an Invalid Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/assignQuoteInspection/50")
               .set('Authorization', 'Bearer ' +token)
               .send({"inspectionId": 2})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 res.text.should.be.eq("Please Input Valid Quote Id")
                 done();
               })
            })
      })

      it("it should Not Apply Inspection to Quote if inspectionId is not valid : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/assignQuoteInspection/1")
               .set('Authorization', 'Bearer ' +token)
               .send({"inspectionId": 7})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(400);
                 res.text.should.be.eq("Please Input Valid Inspection")
                 done();
               })
            })
      })

      it("it should add total value to a Quote : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              chai
               .request(server)
               .post("/admin/quotes/addTotalValue/1")
               .set('Authorization', 'Bearer ' +token)
               .send({"total": 12})
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(200);
                 res.body.should.have.a.property('message').eq("Total Amount Added")
                 done();
               })
            })
      })

      it("it should Convert Quote to Project : Admin", (done) => {
          chai
            .request(server)
            .post("/auth/login")
            .send({"email" : adminEmail, "password" : adminPassword})
            .end((err,res) => {
              const {token} = res.body;
              const id = 182
              chai
               .request(server)
               .put("/admin/quotes/convertToProject/" + id)
               .set('Authorization', 'Bearer ' +token)
               .send({
                  "name":"7",
                  "desc":"nine nine",
                  "startDate":"2022-11-27",
                  "endDate":"2022-12-28"
                })
               .end((err, res) => {
                 const data = res.body;
                 res.should.have.status(201);
                 res.body.should.have.a.property('message').eq("Project created!")
                 done();
               })
            })
      })

    it("it should not Tag Quote and Operation if it is not unique : Admin", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({"email" : adminEmail, "password" : adminPassword})
        .end((err,res) => {
          const {token} = res.body;
          chai
           .request(server)
           .put("/admin/quotes/tagQuotes/")
           .set('Authorization', 'Bearer ' +token)
           .send({
            "quoteId": 1,
            "status": "QUOTE_RECEIVED",
            "operations": [
                    {
                        "operationId": 12,
                        "operation_total_hrs": 4,
                        "operation_cost": 2100,
                        "tools": [
                            {
                                "invId": 1,
                                "reqQty": 50
                            },
                            {
                                "invId": 2,
                                "reqQty": 50
                            }
                        ],
                        "workers": [
                            {
                                "workerId": 1,
                                "totalHrs": 10
                            }
                        ]
                    }
                ]
            })
           .end((err, res) => {
             const data = res.body;
             res.should.have.status(500);
             res.body.should.have.a.property('message').eq("Please try back Later")
             done();
           })
        })
  })

  
  it("it should Tag Quote and Operation : Admin", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        chai
         .request(server)
         .put("/admin/quotes/tagQuotes/")
         .set('Authorization', 'Bearer ' +token)
         .send({
          "quoteId": 99,
          "status": "QUOTE_RECEIVED",
          "operations": [
                  {
                      "operationId": 12,
                      "operation_total_hrs": 4,
                      "operation_cost": 2100,
                      "tools": [
                          {
                              "invId": 1,
                              "reqQty": 50
                          },
                          {
                              "invId": 2,
                              "reqQty": 50
                          }
                      ],
                      "workers": [
                          {
                              "workerId": 1,
                              "totalHrs": 10
                          }
                      ]
                  }
              ]
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.have.a.property('message').eq("Quote and Operations are Tagged Successfully")
           done();
         })
      })
})

it("it should Remove Tag Quote and Operation : Admin", (done) => {
  chai
    .request(server)
    .post("/auth/login")
    .send({"email" : adminEmail, "password" : adminPassword})
    .end((err,res) => {
      const {token} = res.body;
      const id = 99
      chai
       .request(server)
       .delete("/admin/quotes/tagQuotes/" + id)
       .set('Authorization', 'Bearer ' +token)
       .end((err, res) => {
         const data = res.body;
         res.should.have.status(200);
         res.text.should.be.eq('successfully deleted')
         done();
       })
    })
})

it("it should not Remove Tag Quote and Operation if Quote id is not valid : Admin", (done) => {
  chai
    .request(server)
    .post("/auth/login")
    .send({"email" : adminEmail, "password" : adminPassword})
    .end((err,res) => {
      const {token} = res.body;
      const id = 9966;
      chai
       .request(server)
       .delete("/admin/quotes/tagQuotes/" + id)
       .set('Authorization', 'Bearer ' +token)
       .end((err, res) => {
         const data = res.body;
         res.should.have.status(400);
         res.text.should.be.eq('No quote')
         done();
       })
    })
})

  
  it("it should edit Tag Quote and Operation : Admin", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({"email" : adminEmail, "password" : adminPassword})
      .end((err,res) => {
        const {token} = res.body;
        const id = 1
        chai
         .request(server)
         .put("/admin/quotes/tagQuotes/" + id)
         .set('Authorization', 'Bearer ' +token)
         .send({    
            "quoteId": 1,
            "status": "QUOTE_RECEIVED",
            "operations": [
                {
                    "operationId": 12,
                    "operation_total_hrs": 1,
                    "operation_cost": 1,
                    "tools": [
                        {
                            "invId": 1,
                            "reqQty": 5555
                        },
                        {
                            "invId": 2,
                            "reqQty": 5555
                        }
                    ],
                    "workers": [
                        {
                            "workerId": 3,
                            "totalHrs": 5555
                        },
                        {
                            "workerId": 6,
                            "totalHrs": 5555
                        }
                    ]
                }
            ]
          })
         .end((err, res) => {
           const data = res.body;
           res.should.have.status(201);
           res.body.should.have.a.property('message').eq("Tagged Quote and Operations Edited Successfully")
           done();
         })
      })
})

it("it should not edit Tag Quote and Operation with unknown operationID : Admin", (done) => {
  chai
    .request(server)
    .post("/auth/login")
    .send({"email" : adminEmail, "password" : adminPassword})
    .end((err,res) => {
      const {token} = res.body;
      const id = 1
      chai
       .request(server)
       .put("/admin/quotes/tagQuotes/" + id)
       .set('Authorization', 'Bearer ' +token)
       .send({    
          "quoteId": 1,
          "status": "QUOTE_RECEIVED",
          "operations": [
              {
                  "operationId": 1222,
                  "operation_total_hrs": 1,
                  "operation_cost": 1,
                  "tools": [
                      {
                          "invId": 1,
                          "reqQty": 5555
                      },
                      {
                          "invId": 2,
                          "reqQty": 5555
                      }
                  ],
                  "workers": [
                      {
                          "workerId": 3,
                          "totalHrs": 5555
                      },
                      {
                          "workerId": 6,
                          "totalHrs": 5555
                      }
                  ]
              }
          ]
        })
       .end((err, res) => {
         const data = res.body;
         res.should.have.status(500);
         res.body.should.have.a.property('message').eq("Please try back Later")
         done();
       })
    })
})
})