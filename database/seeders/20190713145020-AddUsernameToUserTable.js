'use strict';
const {fetchByEmail, generateUid, all, updateUser} = require('../../app/users/UserRepository');
const randomString = require("randomstring");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});

    */

    const users = await all();
    console.log("Users", users.length)
    users.map(async user => {
      if(user.username == null || user.username == ""){
        let username = `${user.name.substr(0,3)}${randomString.generate({
          charset: "numeric",
          length: 3
        })}`;
        // let u = await user.save();
        // console.log("u", u.username);
        // user.update({username: user.username});
        console.log("username", username);
        const add = await updateUser({username: username}, user.id);
        console.log("uipdatedusername", add);
        // return await user.save();
      }
    });
    // return Promise.all()
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
