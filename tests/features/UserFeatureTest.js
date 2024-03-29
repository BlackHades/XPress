'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    randomSentence = require("random-sentence");

const  expect = chai.expect;


describe("User Controller Test", () => {
   it("should fetch user details and transaction", (done) => {
       const userId = 4;
       const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiJlYmUxMTc0MS00OGFmLTRhNzItOWEyMy04ZmZiMWI1NzI1NGYiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRiYTRrcWp4WmJoM2t4S1ZJZ21WQU4uM2dVMGFlOXdzRVo3Rzc3QzE2TGJZemF4SXF0UUwweSIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiJ9LCJpYXQiOjE1NTE5MDExNjIsImV4cCI6MTU1MjA3Mzk2Mn0.hzmCtYXrKfDcf7OMYEGlNzBF8kt7w8z_XuKepxZKkhA";
       request(app).get(`/api/v1/users/details/${userId}`)
           .set("Authorization",`Bearer ${token}`)
           .end((err,res) => {
           if(err !== undefined && err !== null){
               console.log("Error: " + JSON.stringify(err));
               return done();
           }
           expect(res.statusCode).to.equal(200);
           const response = res.body;
           if(response.status === 1){
               expect(response.data).to.be.an("object");
               console.log("Posts: " + JSON.stringify(response.data))
           }else{
               console.log("Error: status is 0");
           }
           console.log("Body: " + JSON.stringify(response));

           done();
       })
   });
});