"use strict";
exports.collectorQueries = `
login(email:String!,password:String!):loginCreds!
`;
exports.collectorMutations = `


`;
exports.collectorInputs = `


`;
exports.collectorTypes = `
    type loginCreds {
        valid:Boolean!
        token:String!
    }

`;
