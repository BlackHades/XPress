'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("posts", "tags", {
            allowNull: true,
            type: Sequelize.TEXT,
            after: "postedBy",
            defaultValue: null

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("posts", "tags");
    }
};
