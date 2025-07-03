const mongoose = require('mongoose');

const newsletterSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true, // Prevents the same email from subscribing multiple times
        lowercase: true,
        // A simple regex to validate the email format
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;