'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    randomSentence = require("random-sentence");

const  expect = chai.expect;


describe('Comments API Integration Tests', function() {


    it("should fetch all post comment", (done) => {
        const postId = 1;
        request(app).get(`/api/v1/posts/${postId}/comments/fetch`).end((err,res) => {
            if(err !== undefined && err !== null){
                console.log("Error: " + JSON.stringify(err));
                return done();
            }
            expect(res.statusCode).to.equal(200);
            const response = res.body;
            if(response.status === 1){
                expect(response.data).to.be.an("array");
                console.log("Comments: " + JSON.stringify(response.data))
            }else{
                console.log("Error: status is 0");
            }
            console.log("Body: " + JSON.stringify(response));

            done();
        })
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiI3NGYwYjMyYi05ZGUxLTRlYzgtOGY5My03NTViYTI1MzAzNjUiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRSWDJxSm94WllhNVdncFNIRTZ1c2VlNzRKamVGNWdNcmxqTUxoVmR3eDBTSWhSOFRpRE1ERyIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDItMjZUMTI6MDE6NDkuMDAwWiJ9LCJpYXQiOjE1NTExODcwNjAsImV4cCI6MTU1MTM1OTg2MH0.H0F4YRnlAJ0FeaaeZN8cYCIgAbJxRtveNsbPZzp9fg8";
    it('should create comment', function(done) {
        // const admin = await find(1);
        const postId = 1;
        const comment = {
            content:randomSentence({words: 1000})
        };
        request(app).post(`/api/v1/posts/${postId}/comments/create`)
            .set("Authorization",`Bearer ${token}`)
            .send(comment).end((err, res) => {
            console.log("Response: " + JSON.stringify(res));
            expect(res.statusCode).to.equal(200);
            const response = res.body;
            if(response.status === 1){
                console.log("Response: ",JSON.stringify(response.data));
                //assert
            }else{
                console.log("Res: " + JSON.stringify(response));
            }
            // expect(response.data).to.be.an('object');
            done();
        });
    });


    it('should delete comment', function(done) {
        const commentId = 2;
        request(app).delete(`/api/v1/posts/comments/delete/${commentId}`)
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