const express = require('express')
const OpenAI = require('openai')
var bodyParser = require('body-parser')
const port = 3100
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express()
app.use(cors());
app.use(express.json());
const User = require('./models/users.models');
const Subjects = require('./models/subjects.models');
const Topics = require('./models/topics.models');
const Notes = require('./models/notes.models');


// body parsing
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// CONSTANT
const saltRounds = 10;


// CONNECTION TO THE DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'));

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application on a MongoDB connection error
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});



app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Ai Tutor Remastered Backend ')
})





// CONNECT TO OPEN AI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Ai Tutor Backend!')
})



// OPEN AI ROUTES
app.get('/openai', (req, res) => {
    res.status(200).send({
        message: 'hello im the ai teacher'
    })
});

app.post('/openai', async (req, res) => {

    try {
        const userprompt = 'write a poem about the importance of AI learning';

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                // { "role": "system", "content": `${userprompt}` },
                { "role": "user", "content": `${userprompt}` }
            ],
        });
        console.log(response.choices[0]);
        res.status(200).send({
            bot: response.choices[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }

});



// SUBJECTS

// Create a SUBJECT

// Get all subjects
app.get('/subjects', async (req, res) => {
    try {
        const subjects = await Subjects.find().populate('topics');
        res.status(200).json({ subjects });
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a SUBJECT
app.post('/subjects', async (req, res) => {

    console.log(req.body);

    try {
        const subject = await Subjects.create({
            subjectName: req.body.subjectname,
            classLevels: req.body.classLevels,
        });

        if (subject) {
            console.log('Successfully created a subject', subject);
            res.status(201).json({ message: 'Subject created successfully', subject });
        } else {
            console.log('Subject creation failed');
            res.status(400).json({ message: 'Subject creation failed' });
        }
    } catch (error) {
        console.error('An error occurred during subject creation', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// TOPICS

// Get all topics of a subject
app.get('/subjects/:subjectId/topics', async (req, res) => {
    const subjectId = req.params.subjectId;

    try {
        const topics = await Topics.find({ subject: subjectId });
        res.status(200).json({ topics });
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/topics', async (req, res) => {

    console.log(req.body);

    try {
        const topics = await Topics.create({
            topicname: req.body.topicname,
            subject: req.body.subjectid,
        });

        if (topics) {
            console.log('Successfully created a topics', topics);
            res.status(201).json({ message: 'topics created successfully', topics });
        } else {
            console.log('topics creation failed');
            res.status(400).json({ message: 'topics creation failed' });
        }
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// NOTES
// Get all notes of a topic
app.get('/topicnotes/:topicId', async (req, res) => {
    const topicId = req.params.topicId;

    try {
        const subtopics = await Notes.find({ topic: topicId });

        if (!subtopics) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        res.status(200).json({ subtopics });
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/topicnotes/:topicId', async (req, res) => {
    const topicId = req.params.topicId;

    try {
        // Find the topic by ID
        const topic = await Topics.findById(topicId);

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Check if a note for this topic already exists
        const existingNote = await Notes.findOne({ topic: topicId });

        if (existingNote) {
            // If a note exists, push the new slide to the existing note
            existingNote.slides.push({
                text: req.body.text,
                imageUrl: req.body.imageUrl,
            });

            // Save the updated note
            const updatedNote = await existingNote.save();

            console.log('Successfully updated an existing note', updatedNote);
            res.status(201).json({ message: 'Note updated successfully', note: updatedNote });
        } else {
            // If no note exists, create a new note
            const newNote = await Notes.create({
                topic: topicId,
                slides: [{
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                }],
            });

            console.log('Successfully created a new note', newNote);
            res.status(201).json({ message: 'Note created successfully', note: newNote });
        }
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// USERS

//get all users
app.get('/users', async (req, res) => {
    try {
        // Assuming you have a model named "User" that represents your users
        const allUsers = await User.find(); // Use the appropriate method to fetch all users

        if (allUsers) {
            res.status(200).json(allUsers); // Return the users as JSON response
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// create users
app.post('/registeruser', async (req, res) => {
    console.log(req.body);

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = await User.create({
            full_name: req.body.full_name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            schoolLevel: req.body.schoolLevel
        });

        if (user) {
            console.log(`Successfully created a user: ${user}`);
            return res.json({ status: 'ok', message: 'User registered successfully' });
        } else {
            console.log('User was not created successfully');
            return res.status(500).json({ status: 'error', message: 'Failed to create a user' });
        }
    } catch (error) {
        console.error('An error occurred', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});




// LISTENING PORT ON
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})