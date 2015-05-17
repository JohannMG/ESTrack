var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres://postgres:DaVinci@localhost:5432";

var client = new pg.Client(connectionString);
client.connect();
console.log(client);

