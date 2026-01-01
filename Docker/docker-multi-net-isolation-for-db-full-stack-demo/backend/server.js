const http = require('http');
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

client.connect();

http.createServer(async (req, res) => {
  const result = await client.query('SELECT NOW()');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ time: result.rows[0].now }));
}).listen(3000, () => {
  console.log('API listening on 3000');
});
