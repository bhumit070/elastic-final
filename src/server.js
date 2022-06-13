const express = require('express');
const cors = require('cors')
const elasticClient = require('./elastic');
const app = express();
app.use(express.json());

app.use(cors({
	origin: '*'
}))

const INDEX_NAME = 'kibana_sample_data_ecommerce';

class Response {
	constructor(res) {
		this.res = res;
	}

	success({ message = 'Success!', code = 200, data = {} }) {
		this.res.status(code).json({
			error: false,
			message,
			data,
		});
	}

	error({ error, message = 'Server Error!', code = 500, data = {} }) {
		message = error.message ? error.message : message;
		code = error.code
			? error.code
			: error.statusCode
				? error.statusCode
				: code;
		this.res.status(code).json({
			error: true,
			message,
			data,
		});
	}
}

function createSearchPayload(search) {
	const searchQuery = {
		bool: {
			should: []
		}
	}
	for (const key in search) {
		searchQuery.bool.should.push({
			term: {
				[key]: search[key]
			}
		})
	}
	return searchQuery
}

app.post('/data', async (req, res) => {
	try {
		const { size = 1000, from = 0, search } = req.body;


		const searchQuery = createSearchPayload(search)

		const data = await elasticClient.search({
			index: INDEX_NAME,
			size: size,
			from: from,
			query: searchQuery
		});


		const totalData = data.hits?.total?.value || 0

		const hits = data.hits.hits.map((_hit) => _hit._source);

		return new Response(res).success({
			data: {
				data: hits,
				totalData,
			},
		});
	} catch (error) {
		return new Response(res).error({ error });
	}
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`APP is running @ ${PORT}`);
});
