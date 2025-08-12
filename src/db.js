import mysql from 'mysql2';

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pidelcrack2004",
  database: "crud_auth"
});

connection.connect(err => {
  if (err) throw err;
  console.log("Conectado a mySQL exitosamente!");
})
