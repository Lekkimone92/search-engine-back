const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const fs = require('fs');
const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.name
      }
    });

    bulkBody.push(item);
  });

  esClient.bulk({body: bulkBody})
  .then(response => {
    console.log('here');
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(
      `Successfully indexed ${data.length - errorCount}
       out of ${data.length} items`
    );
  })
  .catch(console.err);
};

function test() {
  const restaurantsRaw = fs.readFileSync('results.json');
  let restaurants = JSON.parse(restaurantsRaw);
  console.log('length ',restaurants.length);
  bulkIndex('restauration_caen', 'cuisine', restaurants);
};

test();
