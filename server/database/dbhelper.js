const { query } = require("express");

class DBHelper {
    constructor() {}

    toArrayOfValues(queryResult) {
        return queryResult.map((obj, _) => { return Object.entries(obj)[0][1] })
    }
}

module.exports = new DBHelper();