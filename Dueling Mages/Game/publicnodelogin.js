const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://TheSupremeMageOfEverything42069Imimmature:Secret3point0@duelingmages-tjztt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

MongoClient.connect(uri, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
  const db = client.db('DuelingMages')
  let collection = db.collection('users')
  collection.find({"Username":"2"}, {projection: {Username: 1}}).toArray((err, result)=> {
    // if (err){
    //   throw err;
    // }
    console.log(result);
    if(result == 0){
      console.log("yes")
      collection.insertOne({"Username":"2", "Password":"gudpassword"}, (err, res)=>{
        client.close();
      })
    }
  });
})
