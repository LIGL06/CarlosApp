'use strict'
const express = require('express')
const jade = require('jade')
const fs = require('fs')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const sendgrid = require('sendgrid')(process.env.SENDG_ID)
const app = express()
const db = new sqlite3.Database('carlos.db')
const compHtml = jade.renderFile('./views/email/email.jade')
const port = process.env.PORT || 12000
const host = process.env.HOST || '127.0.0.1'
const emails = []
emails.push({
  name: 'Luis Iván',
  mail: 'luis.garcialuna@outlook.com'
})
emails.push({
  name: 'Carlos Perez',
  mail: 'carlosperezaraujo@outlook.com'
})

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='emails'",
       function(err, rows) {
  if(err !== null) console.log(err)
  else if(rows === undefined) {
    db.run('CREATE TABLE "emails" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"name" VARCHAR(400), ' +
           'url VARCHAR(255))', function(err) {
      if(err !== null) console.log(err)
      else console.log("'Tabla SQL'emails' inicializada.")
    })
  }
  else console.log("Tabla SQL 'emails' ya existente.")
})


app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',function(req,res){
  db.all('SELECT * FROM emails ORDER BY name',function(error,row){
    if (error!==null) next(error)
    else{
      console.log(row)
      res.render('index',{emails:row},function(error,html){
        res.send(200,html)
      })
    }
  })
  // const params = {"emails" : emails}
  // res.render('index',params,function(error,html){
  //   res.send(html)
  // })
})
app.get('/email',function(req,res){
  res.render('email/email')
})
app.get('/delete/:id',function(req,res){
  emails.splice(req.params.id, 1)
  res.redirect('/')
})
app.get('/register',function(req,res){
  res.render('register/index')
})
app.post('/register',function(req,res){
  sendgrid.send({
  to:       req.body.email,
  from:     'no-reply@testing.com',
  subject:  'Post Registro',
  html:     compHtml
  }, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
  })
})
app.post('/add',function(req,res){
  emails.push(req.body)
  res.redirect('/')
})

app.listen(port)
