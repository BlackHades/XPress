
module.exports = (sequelize, type) => {

    return sequelize.define('bitcoins', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:type.STRING,
        lowerBound:type.STRING,
        upperBound:type.STRING,
        value:type.STRING,
        affiliateCharge:{
            type: type.FLOAT,
            defaultValue: 0,
        },
        superAffiliateCharge:{
            type: type.FLOAT,
            defaultValue: 0,
        }
    });
};
// Export the model
// module.exports = mongoose.model('User', UserSchema);