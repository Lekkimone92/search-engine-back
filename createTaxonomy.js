const fs = require('fs');
const restaurantsRaw = fs.readFileSync('results.json');
let restaurants = JSON.parse(restaurantsRaw);

typeArray = restaurants.map(item => {
    return {categorie: item.type_cuisine}
})
console.log(typeArray);
const data = JSON.stringify(typeArray)
fs.writeFile("taxonomy.json", data, function(err) {
  if (err) {
      console.log(err);
  }
});
