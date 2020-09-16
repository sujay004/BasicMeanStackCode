const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
allowedOrigins = ["http://localhost:4200"];
var nodemailer =require('nodemailer');
var bcrypt =require('bcrypt');




var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sujaynandhakumar96@gmail.com',
      pass: 'Sujay@4444'
    }
  });
  
  

  
  const saltRounds = 10;
  // const myPlaintextPassword = 's0/\/\P4$$w0rD';
  // const someOtherPlaintextPassword = 'not_bacon';

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
// const dbName = 'cruddb';
const dbName = 'food_factory';
var MONGO_DB;
// var collection;
// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log(err)
    } else {

        console.log("Connected successfully to server");
        MONGO_DB = client.db(dbName);
        // collection = MONGO_DB.collection('user');
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
var collection = MONGO_DB.collection('user');
    collection.find().toArray((err, body) => {
        if (err) {
            console.log(err);
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
        console.log(body);
        if (body.length > 0) {  
            res.sendStatus(403);
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


  
  
  
  /* GET users listing. */
  app.post('/createUser', function (req, res, next) {
  
    var userData = req.body;
    console.log(userData)
    var collection = MONGO_DB.collection('users');
  
    collection.find({
      user_name: userData.user_name,
      email_id: userData.email_id,
      mobile_number: userData.mobile_number
    }).toArray((err, body) => {
      if (err) {
        res.send(403);
      } else {
        console.log(body)
        if (body.length > 0) {
          res.sendStatus(403);
        } else {
          collection.insertOne({
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_name: userData.user_name,
            password: bcrypt.hashSync(userData.password, saltRounds),
            email_id: userData.email_id,
            mobile_number: userData.mobile_number,
            created_at: new Date(),
            active: 1
          }, (err, body) => {
            if (err) {
              res.sendStatus(403);
            } else {
              res.send(body);
            }
          });
        }
      }
    });
  
  });
  
  
  app.get('/userAuthentication', (req, res) => {
    var user_name = req.query.user_name;
    var password = req.query.password;
    console.log(user_name, password)
  
    const hash = bcrypt.hashSync(password, saltRounds);
    var collection = MONGO_DB.collection('users');
    collection.findOne({
      user_name: user_name,
      password: hash
    }).toArray((err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
  });
  
  
  app.get('/resetPassword', (req, res) => {
    var email_id = req.query.email_id;
    var randomPassword = Math.random().toString(36).substring(7);
    const hash = bcrypt.hashSync(randomPassword, saltRounds);
    var collection = MONGO_DB.collection('users');
    collection.updateOne(
      { email_id: email_id },
      {
        password: hash
      }, (err, body) => {
        if (err) {
          res.sendStatus(403);
        } else {
          var mailOptions = {
            from: 'sujaynandhakumar96@gmail.com',
            to: 'sujaynandhakumar@gmail.com',
            subject: 'About Password Reset',
            text: randomPassword
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      });
  });
  
  
  
  
  
  app.get('/deactiveUser', (req, res) => {
    var user_name = req.query.user_name;
  
    const hash = bcrypt.hashSync(password, saltRounds);
    var collection = MONGO_DB.collection('users');
    collection.updateOne({
      user_name: user_name
    },
      { active: 0 }).toArray((err, body) => {
        if (err) {
          res.sendStatus(403);
        } else {
          res.sendStatus(200);
        }
      });
  });
  
  
  
  
  
  
  app.get('/order/create', function (req, res) {
    console.log('hello--');
    var orderData = req.body;
  
    var collection = MONGO_DB.collection('order');
  
    collection.insertOne({
      user_id: orderData.user_id,
      order_name: orderData.order_name,
      food_id: orderData.food_id,
      qty: orderData.qty,
      offer_price: orderData.offer_price,
      original_price: orderData.original_price,
      offer_name: orderData.offer_name,
      active: 1
    }, (err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.send(body);
      }
    });
  
    // res.render('index', { title: 'Express' });
  });
  
  
  
  app.get('/getAllOrder', function (req, res) {
    console.log('hello--');
    var orderData = req.body;
  
    var collection = MONGO_DB.collection('users');
  
    collection.findOne({
      user_id: orderData.user_id,
      active: 1
    }, (err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.send(body);
      }
    });
  
    // res.render('index', { title: 'Express' });
  });
  
  app.get('/getThresoldQty', function (req, res) {
  
    var collection = MONGO_DB.collection('foods');
  
    collection.findOne({ selling_cost: { $gt: poduction_cost } }).toArray((err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.send(body);
      }
    });
  
    // res.render('index', { title: 'Express' });
  });
  
  
  
  app.get('/getIngredientsBySameVendor', function (req, res) {
    console.log('hello--');
    var vendor_id = req.query.vendor_id;
  
    var collection = MONGO_DB.collection('users');
  
    collection.findOne({
      vendor_id: vendor_id,
    }, (err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.send(body);
      }
    });
  
    // res.render('index', { title: 'Express' });
  });
  
  
  app.get('/getFoodsListOverSellingCost', function (req, res) {
  
    var collection = MONGO_DB.collection('foods');
  
    collection.findOne({ selling_cost: { $gt: poduction_cost } }).toArray((err, body) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.send(body);
      }
    });
  
    // res.render('index', { title: 'Express' });
  });
  


app.listen(8080, () => {
    console.log('Server is listening on 8080 port..!!');
})