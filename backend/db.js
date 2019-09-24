var sqlite3 = require('sqlite3').verbose();
 
const DBSOURCE = "item.sqlite"
// open the database
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asin text UNIQUE,
            name text, 
            sellerName text,
            sellerRating  text, 
            offerPrice  text
            )`,
        (err) => {
            if (err) {
              console.log('Table already created.')  
                // Table already created
            }
        });  
    }
});

module.exports = db