'use strict'
const express = require('express')
const jade = require('jade')
const fs = require('fs')
const sendgrid = require('sendgrid')(process.env.SENDG_ID)
const app = express()
const compHtml = jade.renderFile('./views/email/email.jade',{name: 'Template Correo'})

app.set('view engine','jade')
app.set('views','./views')
app.use(express.static('public'))

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

app.listen(12000)
