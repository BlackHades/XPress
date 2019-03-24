const {Bitcoin} = require("../../../database/sequelize");

const create = (payload) => {
    return Bitcoin.create(payload);
};

const fetch = () => {
    return Bitcoin.findAll({order: [['id', 'DESC']]});
};

const find = (bitcoinId) => {
    return Bitcoin.findByPk(bitcoinId);
};

const update = (payload,bitcoinId) => {
    return Bitcoin.update(payload, {where:{id:bitcoinId}})
};

const destroy = (bitcoinId) => {
    return Bitcoin.destroy({where:{id:bitcoinId}});
};

module.exports = {
    create,
    fetch,
    find,
    update,
    destroy
};