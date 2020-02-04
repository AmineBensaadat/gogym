const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const multer = require('multer');
const upload = multer();

const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const customerRoutes = require('./api/routes/customer');

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: true}));

app.use(bodyparser.json());
// for parsing multipart/form-data
//app.use(upload.array());
app.use(express.static('public'));
app.use('/files', express.static('files')); 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Heders', '*');

    if(req.methode === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).json({}); 
    }

    next();
});




// Routes which should handle requests
app.use('/user', userRoutes);
app.use('/orders', orderRoutes);
app.use('/customer', customerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;