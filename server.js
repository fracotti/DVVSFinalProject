const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/post.model');
const path = require('path');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

mongoose.connect('mongodb+srv://yulianhakh:2Em7j6T2bqpvZUg3@mydb.99ozhzy.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Create a new post
app.post('/posts', async (req, res) => {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
});

// Get post by id
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json(post);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Edit a post
app.put('/posts/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove a post
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        res.json(deletedPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Server started'));
