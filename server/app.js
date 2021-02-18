const express = require('express')
const app = express()
const PORT = 4000
const mongoose = require('mongoose')

//connecting to database
const {mongourl} = require('./config/keys');
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Connected To Database')
})
mongoose.connection.on('error', (err) => {
    console.log('Error While Connecting', err)
})
//connecting to database

//schema require
require('./models/user')
require('./models/post')
//schema require

//requiring routes and middleware
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
//requiring routes

app.listen(PORT, () => {
    console.log('Server Started On Port ' + PORT)
}) 