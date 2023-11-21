const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema(
    {
        topic: { type: mongoose.Schema.Types.ObjectId, ref: 'topics' },
        
        // Change the slides field to an array of objects
        slides: [
            {
                text: { type: String },
                imageUrl: { type: String }
            }
        ],

        // Additional information
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the notes
        createdAt: { type: Date, default: Date.now }, // Timestamp for creation
        updatedAt: { type: Date, default: null } // Timestamp for the last update
    },
    {
        collection: 'notes'
    }
);

const Notes = mongoose.model('Notes', notesSchema);

Notes.on('error', (err) => {
    console.error('Mongoose Notes Model Error:', err);
});

module.exports = Notes;
