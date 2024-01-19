"use strict";
const { collectorResolvers } = require("./collector");
const { citizenResolvers } = require("./citizen");
// exports.RESOLVERS = {
//   ...collectorResolvers,
// };
module.exports = {
    ...collectorResolvers,
    ...citizenResolvers,
};
