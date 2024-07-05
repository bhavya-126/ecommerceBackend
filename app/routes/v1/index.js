'use strict';

/** ******************************
 ********* Import All routes ***********
 ******************************* */
const v1Routes = [
  ...require('./serverRoutes'),
  ...require('./userRoutes'),
  ...require('./productRoutes'),
  ...require('./cartRoutes'),
  ...require('./orderRoutes')
];

module.exports = v1Routes;
