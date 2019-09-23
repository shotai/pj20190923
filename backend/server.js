
const sqlite3  = require('sqlite3').verbose();
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const db = require('./db.js');
const asinScraper = require('amazon-asin-scraper');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
// const dbRoute =
  // 'mongodb://<your-db-username-here>:<your-db-password-here>@ds249583.mlab.com:49583/fullstack_app';

// connects our back end code with the database
// mongoose.connect(dbRoute, { useNewUrlParser: true });

// db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


router.get("/init", (req, res) => {
  var insert = 'INSERT INTO item (asin, name, sellerRating, offerPrice) VALUES (?,?,?,?)'
  db.run(insert, ["test1","abc",4.5, 100])
  db.run(insert, ["test2","bcd",5, 20.9])
  res.json({"message":"success"})
});

// this is our get method
// this method fetches all available data in our database
router.get('/items', (req, res) => {
  var sql = "select * from item"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});



router.get("/item/:id", (req, res, next) => {
    // var asins = req.params.id.split(",").map(function (val) {return "'" + val + "'"}).join(',');
    var sql = "select * from item where asin = ?"
    console.log(sql)

    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


router.get("/new/:id", (req, res, next) => {
    let options = {
      asin : req.params.id,
      proxy : '', //optional
      userAgent : '' //optional
    };
    console.log(options)
    asinScraper(options, (result)=>{
      console.log(result);
      res.json({
        "message": "success"
      });
    });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));