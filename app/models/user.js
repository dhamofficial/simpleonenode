var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
	isAdmin: {
        type: Boolean,
        default: false
    }
});