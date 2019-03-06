'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    jwt = require('jsonwebtoken');


const  expect = chai.expect;
const {find} = require('../../app/api/users/UserRepository');

describe("CardController Test", () => {
    // const user = await find(1);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiIwYTM2NzI5MS1jNGM1LTQwMDktYjM4NC01MmM0MDA2Zjc4OTgiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCQ5NjRYZkF3UWZvZEl6eXd2M0tpY1dlS0d2WE52MkpaeGJmQWszNm9WMnd6d2ZJWEpEenZIaSIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDMtMDVUMTM6MTg6NTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDVUMTM6MTg6NTAuMDAwWiJ9LCJpYXQiOjE1NTE3OTM2NDgsImV4cCI6MTU1MTk2NjQ0OH0.tLoG45IY_xZGobZeSmWC3DpH7K8FVgdGh1dfXUYaNAE";
    it("Should Create Card",  (done) => {
        const card = {
            name: "Itunes",
            description:null,
            country:"USA",
            type:"E-Code",
            priceRange:null,
            amount:"5000"
        };

        // //generate jwt token
        // const token = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
        //     expiresIn: (86400 * 2) // expires in 48 hours
        // });

        request(app)
            .post("/api/v1/cards/create")
            .set("Authorization",`Bearer ${token}`)
            .send(card)
            .end((err, res) => {
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
            })
    });

    it("Should Update Card",  (done) => {
        const card = {
            name: "Itunes",
            description:null,
            country:"USA",
            type:"E-Code",
            priceRange:null,
            amount:"1000"
        };

        // //generate jwt token
        // const token = jwt.sign({ user: user }, process.env.SECURITY_KEY, {
        //     expiresIn: (86400 * 2) // expires in 48 hours
        // });

        request(app)
            .post("/api/v1/cards/update/1")
            .set("Authorization",`Bearer ${token}`)
            .send(card)
            .end((err, res) => {
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
            })
    });

});