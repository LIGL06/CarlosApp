'use strict'
const express = require('express')
const jade = require('jade')
const fs = require('fs')
const sendgrid = require('sendgrid')(process.env.SENDG_ID)
const app = express()
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

app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))

app.get('/',function(req,res){
  const params = {"emails" : emails}
  res.render('index',params,function(error,html){
    res.send(html)
  })
  console.log(emails)
})
app.get('/register',function(req,res){
  res.render('register/index')
})
app.get('/email',function(req,res){
  res.render('email/email')
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


app.listen(port)
