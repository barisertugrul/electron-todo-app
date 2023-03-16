const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "vtetodo"
})

connection.connect()

module.exports = {
    db: connection
}