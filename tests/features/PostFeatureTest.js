'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    randomSentence = require("random-sentence");

const  expect = chai.expect;

const {destroy,find} = require("../../app/api/users/UserRepository");

describe('Post API Integration Tests', function() {


    it("should fetch all posts", (done) => {
       request(app).get("/api/v1/posts/all").end((err,res) => {
           if(err !== undefined && err !== null){
               console.log("Error: " + JSON.stringify(err));
              return done();
           }
           expect(res.statusCode).to.equal(200);
           const response = res.body;
           if(response.status === 1){
               expect(response.data).to.be.an("array");
               console.log("Posts: " + JSON.stringify(response.data))
           }else{
               console.log("Error: status is 0");
           }
           console.log("Body: " + JSON.stringify(response));

           done();
       })
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiI3NGYwYjMyYi05ZGUxLTRlYzgtOGY5My03NTViYTI1MzAzNjUiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRSWDJxSm94WllhNVdncFNIRTZ1c2VlNzRKamVGNWdNcmxqTUxoVmR3eDBTSWhSOFRpRE1ERyIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiJ9LCJpYXQiOjE1NTExODcwNjAsImV4cCI6MTU1MTM1OTg2MH0.H0F4YRnlAJ0FeaaeZN8cYCIgAbJxRtveNsbPZzp9fg8";
    it('should create post', function(done) {
        // const admin = await find(1);
        const post = {
            title:"New Post",
            image:"https://shrouded-lowlands.herokuapp.com/uploads/5e7c9fc274b7e39248a6f4194cd7990a.jpg",
            content:randomSentence({words: 1000})
        };
        request(app).post('/api/v1/posts/create').set("Authorization",`Bearer ${token}`).send(post).end((err, res) => {
            console.log("Response: " + JSON.stringify(res));
            expect(res.statusCode).to.equal(200);
            const response = res.body;
            if(response.status === 1){
                console.log("Payload: ",JSON.stringify(response.data));
                //assert
            }else{
                console.log("Res: " + JSON.stringify(response));
            }
            // expect(response.data).to.be.an('object');
            done();
        });
    });


    it('should delete post', function(done) {
        const postId = 2;
        request(app).delete(`/api/v1/posts/delete/${postId}`)
            .set("Authorization",`Bearer ${token}`)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                console.log("Result: " + JSON.stringify(res));
                const response = res.body;
                console.log("Body: " + JSON.stringify(response));
                done();
            });
    });
});