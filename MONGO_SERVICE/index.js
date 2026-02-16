const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Update your MongoDB URI here (or put in .env later)
const uri = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Connect to specific database (e.g., "scamshield")
        db = client.db("scamshield");

    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
run().catch(console.dir);

// Routes for URL storage
app.post('/api/urls', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const { url, riskLevel, timestamp, user } = req.body;
        const result = await db.collection('urls').insertOne({
            url,
            riskLevel: riskLevel || 'unknown',
            timestamp: timestamp || new Date(),
            user: user || 'anonymous'
        });
        res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for Message storage
app.post('/api/messages', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const { message, analysis, timestamp, user } = req.body;
        const result = await db.collection('messages').insertOne({
            message,
            analysis, // Should be an object storing risk score, detected keywords etc.
            timestamp: timestamp || new Date(),
            user: user || 'anonymous'
        });
        res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for Reports storage
app.post('/api/reports', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const { reportType, description, evidence, user, timestamp } = req.body;
        const result = await db.collection('reports').insertOne({
            reportType,
            description,
            evidence,
            user: user || 'anonymous',
            timestamp: timestamp || new Date(),
            status: 'submitted'
        });
        res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Also enable fetching history (GET)
app.get('/api/urls', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const urls = await db.collection('urls').find().sort({ timestamp: -1 }).limit(50).toArray();
        res.json(urls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const messages = await db.collection('messages').find().sort({ timestamp: -1 }).limit(50).toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for User storage
app.post('/api/users', async (req, res) => {
    if (!db) return res.status(500).json({ error: 'Database not connected' });
    try {
        const { email, username, google_uid, avatar, created_at } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const updateData = {
            email,
            username: username || email.split('@')[0],
            last_login: new Date()
        };

        if (google_uid) updateData.google_uid = google_uid;
        if (avatar) updateData.avatar = avatar;
        if (created_at) updateData.created_at = created_at; // Only set this if provided (e.g. on first creation)

        // Upsert: Update if exists, Insert if not
        const result = await db.collection('users').updateOne(
            { email: email },
            { $set: updateData, $setOnInsert: { created_at: new Date() } },
            { upsert: true }
        );
        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`MongoDB Service running on port ${port}`);
});
