const mongoose = require('mongoose');

const subjectsSchema = new mongoose.Schema(
    {
        subjectName: { type: String },
        classLevels: { type: String },
        
        // Representing a list of topics associated with the subject
        topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'topics' }],

        // Additional information
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the subject
        createdAt: { type: Date, default: Date.now }, // Timestamp for creation
        updatedAt: { type: Date, default: null } // Timestamp for the last update
    },
    {
        collection: 'subjects'
    }
);

const Subjects = mongoose.model('subjects', subjectsSchema);

Subjects.on('error', (err) => {
    console.error('Mongoose Subjects Model Error:', err);
});

module.exports = Subjects;
