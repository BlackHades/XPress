'use strict';
const app = require('../../app'),
    chai = require('chai'),
    request = require('supertest');

const  expect = chai.expect;

const {destroy} = require("../../app/users/UserRepository");
describe('Authentication API Integration Tests', function() {

    it('should sign in user', function(done) {
        const credentials = {
            email:"hades@hades.com",
            password:"Goodbetter123"
        };
        request(app).post('/api/v1/login').send(credentials).end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            const response = res.body;
            if(response.status === 1){
                console.log("Response: " + JSON.stringify(response.data));
                console.log("TOKEN: " + JSON.stringify(response.data.token));
                expect(response.data).to.be.an('object');
            }else{
                console.log("Error: " + JSON.stringify(response));
            }
            done();
        });
    });


    it('should register user', function(done) {
        const user = {
            name:"User User",
            email:"user@us5r.com",
            password:"Goodbeter123",
            phone:"+2347038102474"
        };
        request(app).post('/api/v1/register')
            .send(user)
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                console.log("Result: " + JSON.stringify(res));
                const response = res.body;
                if(response.status === 1){
                    //Delete User
                    const user = response.data.user;
                    destroy(user.id);
                }
                expect(response.data).to.be.an('object');
                done();
        });
    });
});