const mysql = require('mysql');
const pool = dbConnection();

module.exports = function(app) {
    // used to get a true/false response and start a
    // session without returning an html page
    app.get('/api/login', async (req, res) => {
        let response = {"success": false, "error": "None"}

        let username = req.query.uName;
        let password = req.query.pWord;
        if (username === undefined || password === undefined) {
            response.error = "Username or password was not entered"
            return res.send(response)
        }

        let sql = `SELECT * FROM user WHERE username = ?`;
        let rows = await executeSQL(sql, [username]);
        if (rows.length == 0) {
            response.error = "User does not exist";
            res.send(response);
        } else if (!rows[0].password == password) {
            response.error = "Invalid credentials";
            res.send(response);
        }

        // initialize user session variables
        req.session.authenticated = true;
        req.session.username = username;
        req.session.userId = rows[0].userId;

        response.success = true;
        response.userId = rows[0].userId;
        res.send(response)
    });

    app.get('/api/note/all', async (req, res) => {
        let userId = req.query.userId
        let sql = `SELECT noteId, noteText, noteTitle, editTime
            FROM notes WHERE userId = ?`
        let rows = await executeSQL(sql, [userId])
        res.send(rows)
    });
}

async function executeSQL(sql, params){
    return new Promise (function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}

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
