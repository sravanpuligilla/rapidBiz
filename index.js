const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/rapidbiz';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const index = express();

index.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

index.post('/api/getCab', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

index.post('/api/login', (req, res) => {
    // Mock user -- username / password can be validate in DB and then create a token
    const user = {
        id: 1,
        username: 'Sravan',
        email: 'sravan.asmi@gmail.com',
        password: 'password'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '7d' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

index.listen(5000, () => console.log('Server started on port 5000'));