const bcrypt = require('bcryptjs');
const {User, Transaction} = require('../database/sequelize');
const {fetchByEmail, generateUid, all, updateUser} = require('../app/users/UserRepository');
const transactionRepository = require('../app/transactions/TransactionRepository');
// const randomSentence = require("random-sentence");
const randomString = require("randomstring");
let seeder = () => {
    // admin();
    // boss();
    // agent();
    // user();
    // seedUsername();
};

// const boss = async () => {
//     const email = "boss@chiji14xchange.com";
//     let user = await fetchByEmail(email);
//     let uid = await generateUid();
//     if(!user){
//         const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
//         await User.create({
//             name: "Boss",
//             uid: uid,
//             roleId: 1,
//             email: email ,
//             password: hashedPassword,
//             phone: "+2349055695712"
//         });
//         console.log("Boss Seeder Complete");
//     }
// };
//
// const admin = async () => {
//     const email = "hades@hades.com";
//     let user = await fetchByEmail(email);
//     let uid = await generateUid();
//     if(!user){
//         const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
//         await User.create({
//             name: "Hades",
//             uid: uid,
//             roleId: 1,
//             email: email ,
//             password: hashedPassword,
//             phone: "+23470381012174"
//         });
//         console.log("Admin Seeder Complete");
//     }
// };
//
// const agent = async () => {
//     const email = "agent@hades.com";
//     let user = await fetchByEmail(email);
//     let uid = await generateUid();
//     if(!user){
//         const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
//         await User.create({
//             name: "Agent Agent",
//             uid: uid,
//             roleId: 2,
//             email: email ,
//             password: hashedPassword,
//             phone: "+23470381012274"
//         });
//         console.log("Agent Seeder Complete");
//     }
// };

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

const seedUsername = () => {
    all()
        .then(users =>{
            console.log("Users", users.length);
            const res = users.map(async user => {
                if(user.username == null || user.username == ""){
                    let username = `${user.name.substr(0,3)}${randomString.generate({
                        charset: "numeric",
                        length: 3
                    })}`;
                    user.username = username;
                    // let u = await user.save();
                    // console.log("u", u.username);
                    // user.update({username: user.username});
                    // console.log("username", user.username);
                    updateUser({username: username}, user.id)
                        .then(res => {
                            console.log("Ress",res);
                        }).catch(err => {
                        console.log("Inner Error", err);
                    });

                    // return await user.save();
                }
            });
            console.log("Res", res);
        }).catch(err => console.log(err));
};
module.exports = {
    seeder
};