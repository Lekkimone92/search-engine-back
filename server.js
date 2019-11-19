const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const bodyParser = require('body-parser');
const url = require("url");
const fs = require('fs');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const search = function search(index, body) {
  return esClient.search({index: index, body: body});
};

function allRestaurants(formData) {
  let body = {
    size: 168,
    from: 0,
    query: {
      multi_match: {
        query: formData,
        fields: ['name', 'address','type','type_cuisine^2','description'],
        fuzziness: "AUTO",
        prefix_length: 0
      }
    }
  };
  return search('restauration_caen', body);

};

const port = 3000;

esClient
  .ping()
  .then(resp => {
    app.listen(port, function() {
      console.log("Server is listening on port " + port);
    });
  })
  .catch(err => {
    console.log("Elasticsearch server not responding");
    process.exit(1);
  });

app.post("/search", function(req, res) {
  allRestaurants(req.body.formData).then(restaurants => {
    let data = [];
    data = restaurants.hits.hits.map(hit => {
      return hit._source
    })
    res.json(data);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
    });
})


app.get("/taxonomy", function(request, response) {
  const taxonomyRaw = fs.readFileSync('taxonomy.json');
  const taxonomies = JSON.parse(taxonomyRaw);
  response.json(taxonomies);

});
