require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
// const mongoose = require('mongoose');

var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
// });

// con.connect((err) => {
//   if (err){
//       console.log(err);
//   }
//   console.log("Connected!");
// });


mysql.Promise = global.Promise;


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const categoryRoutes = require('./api/routes/categories');

// mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;


// mysql.connect(process.env, { useNewUrlParser: true, useUnifiedTopology: true });
// mysql.Promise = global.Promise;

app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/good',categoryRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})

module.exports = app;