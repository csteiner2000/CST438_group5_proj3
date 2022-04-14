const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));




app.get('/',  (req, res) => {
 res.render('home')
});

app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest


//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err; 
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "td5l74lo6615qq42.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "rromzjicr1yn7h2v",
      password: "q66nhf8a4xwky6a7",
      database: "hzu7gr2xk6zbtl8v"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )