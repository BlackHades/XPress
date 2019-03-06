'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    randomSentence = require("random-sentence");

const  expect = chai.expect;


describe('Transactions API Integration Tests', function() {


    it("should fetch all transactions", (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiJlYmUxMTc0MS00OGFmLTRhNzItOWEyMy04ZmZiMWI1NzI1NGYiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRiYTRrcWp4WmJoM2t4S1ZJZ21WQU4uM2dVMGFlOXdzRVo3Rzc3QzE2TGJZemF4SXF0UUwweSIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiJ9LCJpYXQiOjE1NTE5MDExNjIsImV4cCI6MTU1MjA3Mzk2Mn0.hzmCtYXrKfDcf7OMYEGlNzBF8kt7w8z_XuKepxZKkhA";
        request(app)
            .get(`/api/v1/transactions/all`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res) => {
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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiJlYmUxMTc0MS00OGFmLTRhNzItOWEyMy04ZmZiMWI1NzI1NGYiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRiYTRrcWp4WmJoM2t4S1ZJZ21WQU4uM2dVMGFlOXdzRVo3Rzc3QzE2TGJZemF4SXF0UUwweSIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiJ9LCJpYXQiOjE1NTE5MDExNjIsImV4cCI6MTU1MjA3Mzk2Mn0.hzmCtYXrKfDcf7OMYEGlNzBF8kt7w8z_XuKepxZKkhA";
    it('should create transaction', function(done) {
        // const admin = await find(1);
        const transaction = {
            userId:4,
            amount:40000,
            description:randomSentence({words: 1000})
        };
        request(app).post(`/api/v1/transactions/create`)
            .set("Authorization",`Bearer ${token}`)
            .send(transaction).end((err, res) => {
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