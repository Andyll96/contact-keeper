const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    user: {
        // when we make an entry with MongoDB, the document has an object ID, which is this type
        type: mongoose.Schema.Types.ObjectId,
        // reference to specific collection
        ref: 'users'
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
    },
    type: {
        type: String,
        default: 'personal'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('contact', ContactSchema);