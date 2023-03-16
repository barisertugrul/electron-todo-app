const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    user: "localdemo",
    password: "Local.Demo",
    database: "vtetodo"
})

connection.connect()

module.exports = {
    db: connection
}