const express = require("express");
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

//needed for express to get values from form using POST method
app.use(express.urlencoded({extended:true}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'secret_key!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

//routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.post('/login', async (req, res) => {

    let sql = "SELECT * FROM user";

    let rows = await executeSQL(sql);

    let username = req.body.uName;
    let password = req.body.pWord;

    console.log(rows);
    console.log(username);

    for (let i=0; i < rows.length; i++) {
        if (rows[i].username == username) {
            res.redirect('concerts');
        }
    }
    res.render('login', {"error":"Invalid credentials"})
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {

    let username = req.body.uName;
    let password = req.body.pWord;

    let sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
    let params = [username, password];

    try {
        let rows = await executeSQL(sql, params);
    } catch (error) {
        console.log('SQL Error')
    }

    res.render('index', {'message':'User Added'});
});

app.get('/adminConcert', async(req,res)=>{
    let location = req.body.location;
    let bandName = req.body.bName;
    let date = req.body.date;
    let time = req.body.time;
    // let ticketAmt = req.body.ticketAmt
    res.render('adminConcert', {'message':'Concert Added'});
});

app.get('/adminConcertInfo', async(req,res)=>{
    // let ticketAmt = req.body.ticketAmt
    res.render('adminConcertInfo');
});

app.get('/concerts', async (req,res)=>{

    let sql = "SELECT * FROM concert";
    let rows = await executeSQL(sql);

    console.log(rows[0]);

    res.render('concerts', {"concerts": rows});
});

app.get('/api/concert/:id', async (req, res) => {
    //searching quotes by authorId
    let concert_id = req.params.id;
    let sql = `SELECT *
              FROM concert
              WHERE concertId=${concert_id}`;
    let rows = await executeSQL(sql);
    next();
});


async function executeSQL(sql, params){
    return new Promise (function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}//executeSQLvalues in red must be updated
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