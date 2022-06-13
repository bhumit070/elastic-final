const { Client } = require('@elastic/elasticsearch');

const ELASTIC_URL = 'http://localhost:9200';

const client = new Client({
	node: ELASTIC_URL,
});

function checkElasticStatus() {
	client
		.ping()
		.then(() => {
			// console.log('Elastic is running ', new Date());
		})
		.catch((e) => {
			console.log(`elastic search error`, e, new Date());
			process.exit(1);
		});
	setTimeout(checkElasticStatus, 10_000);
}

checkElasticStatus()

module.exports = client;
