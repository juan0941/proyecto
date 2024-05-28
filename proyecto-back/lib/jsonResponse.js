const { json } = require("express")

exports.jsonResponse = function(statusCode, body) {
    return{
        statusCode,
        body,
    };
}