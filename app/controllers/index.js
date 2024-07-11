'use strict';

/** ******************************
 * Managing all the controllers *
 ********* independently ********
 ******************************* */

module.exports = {
    serverController: require('./serverController'),
    userController: require('./userController'),
    productController: require('./productController'),
    cartController: require('./cartController'),
    orderController: require('./orderController'),
    reviewController: require('./reviewController'),
    dashboardController: require('./dashboardControllers')
};
