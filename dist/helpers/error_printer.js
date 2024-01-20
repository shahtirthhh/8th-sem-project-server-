"use strict";
exports.error = (error_string, where) => {
    console.log(`\n\n\n 💀 ERROR OCCURED\n\tloation: ${where}\n\t${error_string}`);
    return;
};
