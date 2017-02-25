var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
    text: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: ''
    },
    status: {
        type: String,
        default: 'New'
    }
});