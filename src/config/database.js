// Import the createConnection method from TypeORM
const { createConnection } = require("typeorm");

const { MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER } = process.env;

// Create a connection to the database
exports.connect = () => {

    createConnection({
        type: "mysql", // Type of the database
        host: "localhost", // Host where the database is running
        port: 3306, // Database port
        username: MYSQL_USER,// Database username
        password: MYSQL_PASSWORD, // Database password
        database: MYSQL_DATABASE , // Database name
        entities: [
          // Specify your entities here
        ],
        synchronize: true, // Automatically creates the database schema
      }).then(connection => {
        // Here you can start to work with your entities
        console.log("Connection established with success", connection);
      }).catch(error => {
        console.log(error);
        process.exit(1);
      });
      
    
}

