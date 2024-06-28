const { Sequelize } = require('sequelize');
var path = require('path');


var sql = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_USER_PWD,
    dialect: 'mysql',
    logging: true
};

var sqlReader, sqlWriter;

console.log("Local DB Server Structure Model");
sqlReader = {
    ...sql,
    host: process.env.DB_HOST_READER,
    timezone: '+05:00'
}
sqlWriter = {
    ...sql,
    host: process.env.DB_HOST_WRITER,
    timezone: '+05:00'
}

// Connection
var [dbReader, dbWriter] = [{
    sequelize: new Sequelize(
        sql.database,
        sql.username,
        sql.password,
        sqlReader
    )
}, {
    sequelize: new Sequelize(
        sql.database,
        sql.username,
        sql.password,
        sqlWriter
    )
}];
var DbInstance = [{
    'name': dbReader
}, {
    'name': dbWriter
}]

DbInstance.forEach(element => {
    // Model Map    
    element.name['users'] = require(path.join(__dirname, './usersModel'))(element.name['sequelize'], Sequelize);
    element.name['usersLoginLogs'] = require(path.join(__dirname, './userLoginLogsModel'))(element.name['sequelize'], Sequelize);
    element.name['apiLogs'] = require(path.join(__dirname, './apiLogsModel'))(element.name['sequelize'], Sequelize);
    element.name['bookingExtraCharge'] = require(path.join(__dirname, './bookingExtraChargeModel'))(element.name['sequelize'], Sequelize);
    element.name['category'] = require(path.join(__dirname, './categoryModel'))(element.name['sequelize'], Sequelize);
    element.name['comission'] = require(path.join(__dirname, './comissionModel'))(element.name['sequelize'], Sequelize);
    element.name['coupan'] = require(path.join(__dirname, './coupanModel'))(element.name['sequelize'], Sequelize);
    element.name['emailDesignTemplate'] = require(path.join(__dirname, './emailDesignTemplateModel'))(element.name['sequelize'], Sequelize);
    element.name['favouritedService'] = require(path.join(__dirname, './favouritedServiceModel'))(element.name['sequelize'], Sequelize);
    element.name['notification'] = require(path.join(__dirname, './notificationModel'))(element.name['sequelize'], Sequelize);
    element.name['providerComission'] = require(path.join(__dirname, './providerComissionModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceAddress'] = require(path.join(__dirname, './serviceAddressModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceAttachment'] = require(path.join(__dirname, './serviceAttachmentModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceBookingHandyman'] = require(path.join(__dirname, './serviceBookingHandymanModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceBooking'] = require(path.join(__dirname, './serviceBookingModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceBookingPayment'] = require(path.join(__dirname, './serviceBookingPaymentModel'))(element.name['sequelize'], Sequelize);
    element.name['service'] = require(path.join(__dirname, './serviceModel'))(element.name['sequelize'], Sequelize);
    element.name['serviceRating'] = require(path.join(__dirname, './serviceRatingModel'))(element.name['sequelize'], Sequelize);
    element.name['subscription'] = require(path.join(__dirname, './subscriptionModel'))(element.name['sequelize'], Sequelize);
    element.name['subscriptionPayment'] = require(path.join(__dirname, './subscriptionPaymentModel'))(element.name['sequelize'], Sequelize);
    element.name['tax'] = require(path.join(__dirname, './taxModel'))(element.name['sequelize'], Sequelize);
    element.name['userAvailibility'] = require(path.join(__dirname, './userAvailibilityModel'))(element.name['sequelize'], Sequelize);
    element.name['subscriptionPlan'] = require(path.join(__dirname, './subscriptionPlanModel'))(element.name['sequelize'], Sequelize);
    element.name['wallet'] = require(path.join(__dirname, './walletModel'))(element.name['sequelize'], Sequelize);


    // Model Association
    Object.keys(element.name).forEach(function (modelName) {
        if ('associate' in element.name[modelName]) {
            element.name[modelName].associate(element.name);
        }
    });
});


dbReader.Sequelize = Sequelize
dbWriter.Sequelize = Sequelize

module.exports = { dbReader, dbWriter };