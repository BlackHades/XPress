const bcrypt = require('bcryptjs');
const {User} = require('../database/sequelize');
const {fetchByEmail, generateUid} = require('../app/api/users/UserRepository');

let seeder = () => {
    // console.log("Seeding Started");
    admin();
    agent();
    user();
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

module.exports = {
    seeder
};