'use strict';

const  mongoose = require('mongoose')

const connectString = `mongodb+srv://baohung01:%40Abcabc123@cluster0.ohy5w.mongodb.net/`

mongoose.connect(connectString).then(_=> console.log('Connected Mongodb Success'))
.catch(err => console.log('Error Connect'))

//dev
if (1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose;