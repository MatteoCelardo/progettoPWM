let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
let dbName = "progettoPWM";

MongoClient.connect(url+dbName, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db(dbName);
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});