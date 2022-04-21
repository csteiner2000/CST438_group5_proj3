const express = require('express');
const app = express();
const fetch = require('node-fetch');


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/login', (req, res) => { 
   res.render('login');
});

app.get('/signup', (req, res) => { 
   res.render('signup');
});

app.listen(3000, () => {
   console.log('server started');
});