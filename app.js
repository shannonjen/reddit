const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'))

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
    console.log(users)
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

app.get('/users/:id', function(req,res,next){
  const id = req.params.id
  knex('users')
  .where('id',id)
  .first()
  .then(function(user){
    knex('posts')
    .where('user_id', id)
    .then(function(posts){
      res.render('user', {user, posts})
    })

  })
})

app.post('/users/:id', function(req,res,next){
  const id = req.params.id;
  const { title, post } = req.body;
  knex('posts')
  .insert({
    title: title,
    post: post,
    user_id: id
  })
  .then(function(){
    res.redirect('/users/'+id)
  })
})

app.listen(8000, function(){
  console.log('You are listening to port 8000...')
})
