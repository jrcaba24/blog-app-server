const Post = require('../models/Post');
const { errorHandler } = require('../auth');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'userName email');
        res.status(200).json(posts);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'userName email');
        if (!post) return res.status(404).send({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id
        });
        await post.save();
        res.status(201).json({ message: 'Post created', post });
    } catch (err) {
        errorHandler(err, req, res);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).send({ error: 'Forbidden' });

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();
        res.status(200).json({ message: 'Post updated', post });
    } catch (err) {
        errorHandler(err, req, res);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).send({ error: 'Forbidden' });

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        errorHandler(err, req, res);
    }
};

exports.adminDeletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted by admin' });
    } catch (err) {
        errorHandler(err, req, res);
    }
};
