
const sqlite3  = require('sqlite3').verbose();
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const db = require('./db.js');
const asinScraper = require('amazon-asin-scraper');
const crawler = require('crawler');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

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
    var sql = "select * from item where asin = ?"
    console.log("pulling data from db.")

    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if (row === undefined || row.length == 0) {
          console.log("Cannot find in database, pulling from amazon website.")
          var options = {
            asin : req.params.id
          };
          asinScraper(options, (result)=>{
            var insert = 'INSERT INTO item (asin, name, sellerName, sellerRating, offerPrice) VALUES (?,?,?,?,?)'
            db.run(insert, [result.asin,result.sellerList[0].title, result.sellerList[0].sellerName, result.sellerList[0].sellerRating, result.sellerList[0].offerPrice])
            res.json({
                "message":"success",
                "data":[{
                    "asin":result.asin, 
                    "name": result.sellerList[0].title, 
                    "sellerName": result.sellerList[0].sellerName, 
                    "sellerRating": result.sellerList[0].sellerRating,
                    "offerPrice": result.sellerList[0].offerPrice
                  }]
            })
          });
        }
        else {
          res.json({
              "message":"success",
              "data":row
          })
        }
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
        "message": "success",
        "data": result.sellerList[0]
      });
    });
});



router.get("/test/:id", (req, res, next) => {
    var c = new crawler() 
    c.direct({
      uri: 'https://www.amazon.com/dp/'+ req.params.id,
      skipEventRequest: false, // default to true, direct requests won't trigger Event:'request'
      callback: function(error, response) {
          if(error) {
            console.log(error)
          } else {
            console.log(response)
            var $ = response.$;
            console.log($('price').text())
            console.log(response.statusCode);
          }
          res.json({
            "message": "success",
          });
      }
  });
});


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));