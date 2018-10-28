const mongoose = require('mongoose');

const cabSchema = mongoose.Schema({
    cabId: Number,
    displayName: String,
    phone:String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:String,
    location: {
        type: { type: String },
        coordinates: []
    }
});

cabSchema.index({"location": "2dsphere"});

module.exports = mongoose.model('Cab', cabSchema);