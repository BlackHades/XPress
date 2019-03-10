'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest'),
    jwt = require('jsonwebtoken');


const  expect = chai.expect;
const {find} = require('../../app/api/users/UserRepository');

describe("CardController Test", () => {
    // const user = await find(1);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1aWQiOiJlYmUxMTc0MS00OGFmLTRhNzItOWEyMy04ZmZiMWI1NzI1NGYiLCJyb2xlSWQiOjIsIm5hbWUiOiJIYWRlcyIsImVtYWlsIjoiaGFkZXNAaGFkZXMuY29tIiwicGhvbmUiOiIrMjM0NzAzODEwMTIxNzQiLCJwYXNzd29yZCI6IiQyYSQxMCRiYTRrcWp4WmJoM2t4S1ZJZ21WQU4uM2dVMGFlOXdzRVo3Rzc3QzE2TGJZemF4SXF0UUwweSIsImF2YXRhciI6bnVsbCwibGFzdFNlZW4iOm51bGwsImNyZWF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDZUMTU6MTE6NTAuMDAwWiJ9LCJpYXQiOjE1NTIyMTg4ODQsImV4cCI6MTU1MjM5MTY4NH0.3BXyQV4yVfDa5onIwfp2SNhCH4TgAERfrGABrysVBlE";
    it("Should Fetch All Cards",  (done) => {

        request(app)
            .get("/api/v1/cards/all")
            .end((err, res) => {
                console.log("Response: " + JSON.stringify(res));
                expect(res.statusCode).to.equal(200);
                const response = res.body;
                if(response.status === 1){
                    console.log("Payload: ",JSON.stringify(response.data));
                    expect(response.data).to.be.an("array");
                    //assert
                }else{
                    console.log("Res: " + JSON.stringify(response));
                }
                done();
            })
    });


    it("Should Fetch Card Group By Name",  (done) => {

        request(app)
            .get("/api/v1/cards/all/name")
            .end((err, res) => {
                console.log("Response: " + JSON.stringify(res));
                expect(res.statusCode).to.equal(200);
                const response = res.body;
                if(response.status === 1){
                    console.log("Payload: ",JSON.stringify(response.data));
                    expect(response.data).to.be.an("object");
                    //assert
                }else{
                    console.log("Res: " + JSON.stringify(response));
                }
                done();
            })
    });


    it("Should Fetch One Card",  (done) => {

        request(app)
            .get("/api/v1/cards/show/1")
            .end((err, res) => {
                console.log("Response: " + JSON.stringify(res));
                expect(res.statusCode).to.equal(200);
                const response = res.body;
                if(response.status === 1){
                    console.log("Payload: ",JSON.stringify(response.data));
                    expect(response.data).to.be.an("object");
                    //assert
                }else{
                    console.log("Res: " + JSON.stringify(response));
                }
                done();
            })
    });


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


    it("Should Delete Card",  (done) => {
        request(app)
            .delete("/api/v1/cards/delete/2")
            .set("Authorization",`Bearer ${token}`)
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



    it("Should Toggle card Availability Card",  (done) => {
        request(app)
            .get("/api/v1/cards/toggle-availability/2")
            .set("Authorization",`Bearer ${token}`)
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