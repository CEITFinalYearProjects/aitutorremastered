const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        full_name: { type: String},
        email: { type: String},
        password: { type: String },
        schoolLevel: { type: String },
        age: { type: Number },
        role: { type: String},
        profilepicture: {type: String},
        Achievements:  {type: String}
    },
    {
        collection: 'User'
    }
);

const User = mongoose.model('User', userSchema);

User.on('error', (err) => {
    console.error('Mongoose User Model Error:', err);
});

module.exports = User;
