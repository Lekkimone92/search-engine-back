const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});


const search = function search(index, body) {
  return esClient.search({index: index, body: body});
};

const test = function test() {
  let body = {
    size: 422,
    from: 0,
    query: {
      match_all: {}
    }
  };

  search('restaurants_caen', body)
  .then(results => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log(`returned article titles:`);
    results.hits.hits.forEach(
      (hit, index) => console.log(
        `\t${body.from + ++index} - ${hit._source.name}- ${hit._source.address}- ${hit._source.horaires}`
      )
    )
  })
  .catch(console.error);
};

test();
