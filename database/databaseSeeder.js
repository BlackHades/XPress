const bcrypt = require('bcryptjs');
const {User} = require('../database/sequelize');
const {fetchByEmail} = require('../app/api/users/UserRepository');


let seeder = ()=> {
    // console.log("Seeding Started");
    admin();
};


let admin = async () => {
    const email = "hades@hades.com";
    let user = await fetchByEmail(email);
    if(!user){
        const hashedPassword = bcrypt.hashSync("Goodbetter123",  bcrypt.genSaltSync(10));
        User.create({
            name: "Hades",
            roleId: 1,
            email: email ,
            password: hashedPassword,
            phone: "+23470381012474"
        });

        console.log("Admin Seeder Complete");
    }
};

module.exports = {
    seeder
};