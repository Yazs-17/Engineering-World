const http = require('http');

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ msg: `
    node_env: ${process.env.NODE_ENV},
    log_level: ${process.env.LOG_LEVEL}
  ` }));
}).listen(3000, () => {
  console.log('backend listening on 3000');
});
