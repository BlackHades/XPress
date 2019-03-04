'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    randomSentence = require("random-sentence");

const  expect = chai.expect;


describe("User Controller Test", () => {
   it("should fetch user details and transaction", (done) => {
       const userId = 1;
       const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiI3NGYwYjMyYi05ZGUxLTRlYzgtOGY5My03NTViYTI1MzAzNjUiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRSWDJxSm94WllhNVdncFNIRTZ1c2VlNzRKamVGNWdNcmxqTUxoVmR3eDBTSWhSOFRpRE1ERyIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiJ9LCJpYXQiOjE1NTE3MTk2NzMsImV4cCI6MTU1MTg5MjQ3M30.RZnkVTwipPIWd3TnGdep9HvhWhTEQplZKmOxeCL6E0Q";
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