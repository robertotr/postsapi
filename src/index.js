const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const users = require('./data/users.json');
const posts = require('./data/posts.json');
const comments = require('./data/comments.json');

const port = 3456;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users/:userId', (req, res, next) => {
    const user = users.find((user) => { return parseInt(user.id) === parseInt(req.params.userId)});

    if(user) {
        return res.status(200).json(user);
    } else {
        next();
    }
});

app.post('/users', (req, res) => {
    const nextId = users && users.length > 0 ? Math.max(...users.map((user) => { return user.id; })) + 1 : 1;

    const newUser = { ...req.body, id: nextId, active: true };

    users.push(newUser);

    res.status(202).json(newUser);
});

app.get('/posts' , (req, res) => {
    res.status(200).json(posts);
});

app.post('/posts', (req, res) => {
    const author = users.find((user) => { return parseInt(user.id) === parseInt(req.body.authorid)});

    if(!author) {
        res.status(400).json({ error: { message: "Author doesn'exist" } });
        return;
    }

    const nextId = posts && posts.length > 0 ? Math.max(...posts.map((post) => { return post.id; })) + 1 : 1;

    const newPost = { ...req.body, id: nextId, created: new Date(), modified: new Date() };

    posts.push(newPost);

    res.status(202).json(newPost);
});

app.get('/posts/:postId' , (req, res, next) => {
    const post = posts.find((post) => parseInt(post.id) === parseInt(req.params.postId));

    if(post) {
        return res.status(200).json(post);
    } else {
        next();
    }
});

app.get('/posts/:postId/comments' , (req, res, next) => {
    const post = posts.find((post) => parseInt(post.id) === parseInt(req.params.postId));

    if(post) {
        const post_comments = comments.filter((comment) => parseInt(comment.postid) === parseInt(req.params.postId));

        return res.status(200).json(post_comments);
    } else {
        next();
    }
});

app.get("*", (req, res) => {
    res.status(404).send("<h1>404 Page Not Found</h1>");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});