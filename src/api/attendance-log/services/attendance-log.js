'use strict';

/**
 * attendance-log service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attendance-log.attendance-log');
