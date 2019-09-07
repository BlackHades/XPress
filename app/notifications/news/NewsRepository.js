
"use strict";
const Repository = require("../../Repository");
const { News } = require("../../../database/sequelize");
class NewsRepository extends Repository {
    constructor() {
        super(News);
    }
}
module.exports = (new NewsRepository());