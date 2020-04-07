const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
allowedOrigins = ["http://localhost:4200"];

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
// parse application/json
app.use(bodyParser.json());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'cruddb';
var MONGO_DB;
var collection;
// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log(err)
    } else {

        console.log("Connected successfully to server");
        MONGO_DB = client.db(dbName);
        collection = MONGO_DB.collection('user');
    }

    // client.close();
});



app.post('/api/authenticateUser', (req, res) => {
    console.log(req.body)
    var email = req.body.email;
    var password = req.body.password;
    collection.find({ email: email, password: password }).toArray((err, body) => {
        if (err) {

        } else {

            if (body.length > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(403);
            }

        }


    })


});



app.get('/api/listUser', (req, res) => {

    collection.find().toArray((err, body) => {
        if (err) {
            console.log(err)
        } else {
            res.send(body);

        }
    })


});


app.post('/api/addUser', (req, res) => {
    var user = req.body;
    console.log('user---', user)
    collection.find(user).toArray((err, body) => {
        console.log(body)
        if (body.length > 0) {  
           res.sendStatus(403);

        } else {

            collection.insertOne(user, (err, body) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.sendStatus(200);
                }
            });

        }
    });
});


app.post('/api/updateUser', (req, res) => {
    var user = req.body;
    console.log('user---', user)
    collection.find({
        firstname:user.firstname,
        lastname:user.lastname,
        email:user.email,
        }).toArray((err, body) => {
        console.log(body)
        if (body.length > 0) {  
          
            res.sendStatus(403)
        } else {

            var id = ObjectId.isValid(req.body._id) ? ObjectId(req.body._id) : req.body._id;
            collection.updateOne({ _id: id }, {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                }
            }, (err, body) => {
    
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.sendStatus(200);
    
                }
            });

        }
    });
});



app.get('/api/deleteUser', (req, res) => {
    var _id = ObjectId.isValid(req.query._id) ? ObjectId(req.query._id) : req.query._id;
    console.log('_id---', _id)
    collection.deleteOne({ _id: _id }, (err, body) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.send({ message: 'success' });
        }
    });

});


app.listen(8080, () => {
    console.log('Server is listening on 8080 port..!!');
})