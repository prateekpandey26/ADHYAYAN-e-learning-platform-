const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Golupandey@2612', // ← yaha apna MySQL root password daalo
  database: 'e_learning_db'        // ← database ka naam jo tumne create kiya hai
});

connection.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

module.exports = connection;
