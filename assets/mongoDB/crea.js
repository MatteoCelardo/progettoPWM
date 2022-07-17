const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const dbName = "progettoPWM";
const collectionName = "users";

MongoClient.connect(url+dbName, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db(dbName);
  dbo.createCollection(collectionName, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db(dbName);
  dbo.collection(collectionName).insertOne({email: "mail@prova.it", user: "utenteProva", pw:"6258a5e0eb772911d4f92be5b5db0e14511edbe01d1d0ddd1d5a2cb9db9a56ba"}, (err,result)=>{
    console.log("user created!");
    db.close();
  });
  
});

/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let dbo = db.db(dbName);
  dbo.collection(collectionName).createIndex({ user: 1 }, { unique: true});
});*/
