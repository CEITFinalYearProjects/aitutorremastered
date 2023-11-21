const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema(
    {
        topicname: { type: String },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'subjects' },
        subtopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subtopics' }],

        // Additional information
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the topic
        createdAt: { type: Date, default: Date.now }, // Timestamp for creation
        updatedAt: { type: Date, default: null } // Timestamp for the last update
    },
    {
        collection: 'topics'
    }
);

const Topics = mongoose.model('topics', topicsSchema);

Topics.on('error', (err) => {
    console.error('Mongoose Topics Model Error:', err);
});

module.exports = Topics;
