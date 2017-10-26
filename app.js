const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');
app.set('view engine', 'ejs');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile.js')[environment];
const knex = require('knex')(knexConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/users', function(req,res,next){
  knex('users')
  .then(function(users){
    res.render('users',{users});
  })
})

app.post('/users', function(req,res,next){
  const { username } = req.body
  knex('users')
  .insert({
    username: username
  })
  .then(function(){
    res.redirect('/users')
  })
})

app.listen(8000, function(){
  console.log('You are listening to port 8000...')
})
