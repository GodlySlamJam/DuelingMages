const express = require("express")
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const path = require("path")
const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const uri = "mongodb+srv://TheSupremeMageOfEverything42069Imimmature:Secret3point0@duelingmages-tjztt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

app.use(cookieParser())
app.use(session({secret:"jkbhea45ytghb9787yrtdx45656u5t87iuljbe6768i7uyh"}))
let public = require('path').join(__dirname,'/public');
app.use(express.static(public));

app.post("/login/", (req, res)=>{
  console.log("HERE")
  // console.log(req)
  let username = req.body.Username;
  let password = req.body.Password;

  console.log(username)
  // console.log(password)

  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let collection = db.collection('users')
    collection.find({"Username": username, "Password": password}).toArray((err, result)=> {
      console.log(result);
      if(result.length){
        console.log("yes")
        req.session.Username = result[0].Username
        req.session.id = result[0]._id
        res.cookie('DuelingMagesSOCOOLVERYHOTWOWIEWOWOMGGOD1LOLOLOOLOid', req.session.id)
        res.cookie('DuelingMagesSOCOOLVERYHOTWOWIEWOWOMGGOD1LOLOLOOLOUN', req.session.Username)
        //fix redirect
        res.send("somting")
        client.close()
      }else{
        return res.status(400).send({
          message: 'no'
        });
      }
    });
  })
})

app.post("/account/", (req, res)=>{
  console.log("HERE")
  // console.log(req)
  let username = req.body.Username;
  let password = req.body.Password;
  let cpassword = req.body.CPassword;
  if(username.length <= 15 && password === cpassword){

    MongoClient.connect(uri, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      const db = client.db('DuelingMages')
      let collection = db.collection('users')
      collection.find({"Username": username}).toArray((err, result)=>{
        if(result.length){
          return res.status(400).send({
            message: 'Name taken'
          });
        }else{
          collection.insertOne({"Username": username, "Password": password}, (err, result)=> {
            console.log(result);
            if(result.length){
              res.send("Made")
              client.close()
            }else{
              return res.status(400).send({
                message: 'server error'
              });
            }
          })
        }
      })
    })
  }else{
    return res.status(400).send({
      message: 'check fields'
    });
  }
})

app.post("/waiting-for-game/", (req, res)=>{
  let username = req.body.Username;
  let p2pid = req.body.p2pid;
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('wfg')
    console.log(req.session.Username)
    console.log(username)
    wfg.find({"Username": req.session.Username}).toArray((err, result)=>{
      console.log(result)
      if(result.length){
        console.log("almost")
        console.log(result)
        return res.status(400).send({
          message: 'already here'
        });
      }else{
        console.log("algameS")
        res.send("Yay")
        wfg.insertOne({"Username": username, "p2pid":p2pid}, (err, res)=>{
          client.close();
        })
      }
    })
  })
})

app.get("/logout/", (req, res)=>{
  req.session.id = null;
  req.session.Username = null;
})

app.get("/waiting-for-game/", (req, res)=>{
  if(req.session.id){
    res.sendFile(path.join(__dirname + '/waiting-for-game.html'))
  }
})

app.get("/wfglist/", (req, res)=>{
  if(req.session.id){
    MongoClient.connect(uri, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      const db = client.db('DuelingMages')
      let wfg = db.collection('wfg')
      wfg.find({}).toArray((err, result)=> {
        console.log(result);
        if(result){
          console.log("yeas")
          //fix redirect
          res.send([result, "DuelingMagesSOCOOLVERYHOTWOWIEWOWOMGGOD1LOLOLOOLO"])
          client.close()
        }
      });
    })
  }
})

app.get("/DuelingMagesHost/", (req, res)=>{
  res.sendFile(path.join(__dirname + '/index.html'))
  console.log("GAMETIME")
})

app.get("/DuelingMagesRider/", (req, res)=>{
  res.sendFile(path.join(__dirname + '/rider.html'))
  console.log("GAMETIME")
})

app.post("/p2pid/", (req, res)=>{
  let username = req.body.Username;
  let p2pid = req.body.p2pid;
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('p2pid')
    //add delete
    wfg.deleteMany({"Username": req.session.Username}, (err, obj)=>{
      if(err){
        return
      }else{
        wfg.find({_id: req.session.id, "Username": req.session.Username}).toArray((err, result)=>{
          if(result.length){
            console.log("almost")
            console.log(result)
            return
          }else{
            console.log("algameS")
            res.send("Yay")
            wfg.insertOne({"Username": username, "p2pid":p2pid}, (err, res)=>{
              client.close();
            })
          }
        })
      }
    })
  })
})


app.post("/p2plist/", (req, res)=>{
  if(req.session.id){
    MongoClient.connect(uri, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      const db = client.db('DuelingMages')
      let wfg = db.collection('p2pid')
      wfg.find({"Username": req.body.Username}).toArray((err, result)=> {
        console.log(result);
        if(result.length){
          console.log("yeas")
          //fix redirect
          res.send([result])
          client.close()
        }
      });
    })
  }
})

app.get("/p2pdelete/", (req, res)=>{
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('p2pid')
    //add delete
    wfg.deleteMany({"Username": req.session.Username}, (err, obj)=>{
      if(err){
        return
      }else{
        res.send("YAY")
      }
    })
  })
})

app.post("/wfgdelete/", (req, res)=>{
  let p2pid = req.body.p2pid;
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('wfg')
    //add delete
    console.log(p2pid)
    wfg.deleteMany({"p2pid": p2pid}, (err, obj)=>{
      if(err){
        return
      }else{
        res.send("YAY")
      }
    })
  })
})

app.get("/loading/", (req, res)=>{
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('load')
    //add delete
    wfg.insertOne({"Username": req.session.Username}, (err, obj)=>{
      if(err){
        return
      }else{
        res.send("YAY")
      }
    })
  })
})

app.post("/loading/", (req, res)=>{
  let username = req.body.Username
  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('DuelingMages')
    let wfg = db.collection('load')
    //add delete
    wfg.deleteMany({"Username": username}, (err, obj)=>{
      if(err){
        return
      }else{
        res.send("YAY")
      }
    })
  })
})


app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname + '/login.html'))
  console.log("here")
})
app.listen(3000);
