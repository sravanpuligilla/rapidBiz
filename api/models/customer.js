const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    customerId: Number,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    mobile:String,
    location: {
        type: {
            type: 'String'
        },
        address: {
            type: 'String'
        },
        coordinates: {
            type: [
                'Number'
            ]
        }
    }
});

module.exports = mongoose.model('Customer', customerSchema);