const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/rapidbiz';
mongoose.connect(mongoDB, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const cabsRoutes = require('./api/routes/cabs');
const customersRoutes = require('./api/routes/customers');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use('/cabs', cabsRoutes);
app.use('/customers', customersRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
