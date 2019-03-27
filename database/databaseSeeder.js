const bcrypt = require('bcryptjs');
const {User, Transaction} = require('../database/sequelize');
const {fetchByEmail, generateUid} = require('../app/api/users/UserRepository');
const transactionRepository = require('../app/api/transactions/TransactionRepository');
const     randomSentence = require("random-sentence");
let seeder = () => {
    admin();
    agent();
    user();
    transactions();
};


const admin = async () => {
    const email = "hades@hades.com";
    let user = await fetchByEmail(email);
    let uid = await generateUid();
    if(!user){
        const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
        await User.create({
            name: "Hades",
            uid: uid,
            roleId: 1,
            email: email ,
            password: hashedPassword,
            phone: "+23470381012174"
        });
        console.log("Admin Seeder Complete");
    }
};

const agent = async () => {
    const email = "agent@hades.com";
    let user = await fetchByEmail(email);
    let uid = await generateUid();
    if(!user){
        const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
        await User.create({
            name: "Agent Agent",
            uid: uid,
            roleId: 2,
            email: email ,
            password: hashedPassword,
            phone: "+23470381012274"
        });
        console.log("Agent Seeder Complete");
    }
};

const user = async () => {
    const email = "user@hades.com";
    let user = await fetchByEmail(email);
    let uid = await generateUid();
    if(!user){
        const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
        await User.create({
            name: "User User",
            uid: uid,
            roleId: 3,
            email: email ,
            password: hashedPassword,
            phone: "+23470381012474"
        });
        console.log("User Seeder Complete");

    }
};


const transactions = async () => {
    for(let i = 0; i < 20; i++){
        Transaction.create({
            transactionId: await  transactionRepository.generateTransactionId(),
            bitcoinId:1,
            userId: i > 10 ? 19 : 11,
            transactionType:"BITCOIN",
            description: randomSentence({words: 1000}),
            createdBy: 2,
            amount: 100000 * Math.random()
        });
    }

    for(let i = 0; i < 20; i++){
        Transaction.create({
            transactionId: await  transactionRepository.generateTransactionId(),
            cardId:1,
            userId: i > 11,
            transactionType:"CARD",
            description: randomSentence({words: 1000}),
            createdBy: 2,
            amount: 100000 * Math.random()
        });
    }
};
module.exports = {
    seeder
};