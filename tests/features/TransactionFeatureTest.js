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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJ1aWQiOiJmZWY0YzhlNS04NzYzLTQxZWItYTdlZC0zZGU4MGZlZDBhMDciLCJyb2xlSWQiOjEsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRlTXhPNlZKQ3VRNUhLcXBpMXA5elN1YkNkcWxSajF1ekl4QnAuVkwyb0NuMUt6bGg5MlZZUyIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsInN0YXR1cyI6Im9mZmxpbmUiLCJjcmVhdGVkQXQiOiIyMDE5LTAzLTI0VDAyOjMzOjMxLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDE5LTAzLTI1VDEwOjAzOjU1LjAwMFoifSwiaWF0IjoxNTUzNjQ1MTUxLCJleHAiOjE1NTM4MTc5NTF9.6cQenQgX7mJf423giq2hiFR_-lnhriSeH1hbfW5i8ic";
    it('should create transaction', function(done) {
        // const a dmin = await find(1);
        const transaction = {
            userId:1,
            amount:40000,
            description:randomSentence({words: 1000}),
            transactionType:"BITCOIN",
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


    it('should delete transaction', function(done) {
        const transactionId = 644067159430;
        request(app).delete(`/api/v1/transactions/delete/${transactionId}`)
            .set("Authorization",`Bearer ${token}`)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                console.log("Result: " + JSON.stringify(res));
                const response = res.body;
                console.log("Body: " + JSON.stringify(response));
                done();
            });
    });


    it("should fetch one transaction by transaction Id", (done) => {
        const transactionId = 644067159430;
        request(app).get(`/api/v1/transactions/show/${transactionId}`)
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