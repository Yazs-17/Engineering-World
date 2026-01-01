const http = require('http');
const { Client } = require('pg');
const { Client: ES } = require('@elastic/elasticsearch');
const { createClient } = require('redis');

const pg = new Client({
	host: process.env.PG_HOST,
	user: process.env.PG_USER,
	password: process.env.PG_PASS,
	database: process.env.PG_DB,
});

const es = new ES({
	node: process.env.ES_HOST,
});

const redis = createClient({
	url: process.env.REDIS_URL,
});

redis.on('error', err => console.log('Redis Client Error', err));

async function waitForService (name, checkFn, retries = 10) {
	while (retries > 0) {
		try {
			await checkFn();
			console.log(`${name} connected`);
			return true;
		} catch (e) {
			console.log(`Waiting for ${name}...`);
			await new Promise(r => setTimeout(r, 3000));
			retries--;
		}
	}
	console.error(`${name} not available`);
	return false;
}

(async () => {
	// 连接所有服务
	await waitForService('Postgres', () => pg.connect());
	await waitForService('Elasticsearch', () => es.ping());
	await waitForService('Redis', () => redis.connect());

	console.log('All services connected');
})();

http.createServer(async (req, res) => {
	try {
		const pgRes = await pg.query('SELECT NOW()');

		await es.index({
			index: 'logs',
			document: { time: new Date(), msg: 'api called' },
		});

		// Redis 示例：记录访问次数
		const visits = await redis.incr('visits');

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			postgresTime: pgRes.rows[0].now,
			elasticsearch: 'indexed log',
			redisVisits: visits,
		}));
	} catch (err) {
		res.statusCode = 500;
		res.end(JSON.stringify({ error: err.message }));
	}
}).listen(3000, () => {
	console.log('API listening on 3000');
});
