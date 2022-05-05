const express = require("express");
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

let currentUser = "";
let currentUserName = "";
let currentNote = "";

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

    let username = req.body.uName;
    let password = req.body.pWord;

    let sql = `SELECT * FROM user WHERE username = ?`;

    let rows = await executeSQL(sql, [username]);

        try {
            if (rows[0].password == password) {
                req.session.authenticated = true;
                currentUser = rows[0].userId;
                currentUserName = rows[0].username;
                let sql2 = `SELECT * FROM notes WHERE userId = ${currentUser}`;
                let notes = await executeSQL(sql2);
                res.render('landing', {currentUser:currentUser, notes:notes, rows:rows});
            }
    }
    catch(e){
        {
            console.log('Login Error');
            res.render('login', {"error":"Invalid credentials "});
        }
    }
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
        console.log('SQL Error');
    }

    res.render('index', {'message':'User Added'});
});

app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.destroy();
    currentUser = "";
    res.redirect('/');
});

app.post('/editNote', async (req, res) =>{
    res.render('landing', {rows: rows});
});

app.get('/addnote', async(req,res)=>{
    res.render('addnote');
});
app.post('/addnote', async(req,res)=>{
    let ntitle = req.body.noteTitle;
    let ntext = req.body.noteText;

    let sql = "INSERT INTO notes (noteTitle, noteText, userId) VALUES (?,?,?)";
    let params = [ntitle, ntext, currentUser];
    let rows = await executeSQL(sql, params);

    let sql2 = `SELECT * FROM notes WHERE userId = ${currentUser}`;
    let notes = await executeSQL(sql2);

    let sql5 = `SELECT * FROM user WHERE userId = ${currentUser}`;
    rows = await executeSQL(sql5, [currentUserName]);

    res.render('landing', {currentUser:currentUser, notes:notes, rows:rows});
});

app.post('/deleteNote', async (req, res) =>{
    let noteId = req.body.noteId;

    //find what note is trying to be deleted
    let selectNote = `SELECT * FROM notes WHERE noteId=${noteId}`;
    let rows2 = await executeSQL(selectNote);

    //delete note from table
    let deleteSQL = `DELETE FROM notes WHERE noteId=${noteId}`;
    let rows1 = await executeSQL(deleteSQL);

    res.render('index');
});

app.get('/api/noteInfo', async (req, res) => {
    //searching quotes by authorId
    let note_id = req.query.noteId;
    let sql = `SELECT * FROM notes WHERE noteId = ${note_id}`;
    let rows = await executeSQL(sql);
    res.send(rows);
});

app.get('/api/note/:id', async (req, res) => {
    //searching quotes by authorId
    let note_id = req.params.id;
    let sql = `SELECT *
              FROM notes
              WHERE noteId = ${note_id}`;
    let rows = await executeSQL(sql);
    //console.log(author_id);
    res.send(rows);
});

app.get('/api/allUsers', async (req, res) => {

    let sql = `SELECT *
              FROM user`;
    let rows = await executeSQL(sql);
    //console.log(author_id);
    res.send(rows);
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

        connectionLimit: 2,
        host: "td5l74lo6615qq42.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "rromzjicr1yn7h2v",
        password: "q66nhf8a4xwky6a7",
        database: "hzu7gr2xk6zbtl8v"

    });

    return pool;

} //dbConnection

//start server
app.listen(8080, () => {
    console.log("Welcome!\nExpress server running...")
} )