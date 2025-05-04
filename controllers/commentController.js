const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { errorHandler } = require('../auth');

// Get all comments for a specific post
exports.getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', '_id username email') // Include _id, username, and email
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).send({ error: 'Post not found' });
  
      const comment = new Comment({
        content: req.body.content,
        post: req.params.postId,
        author: req.user.id // ✅ sets logged-in user as author
      });
  
      await comment.save();
  
      const populatedComment = await comment.populate('author', 'userName email');
      res.status(201).json(populatedComment);
    } catch (err) {
      errorHandler(err, req, res);
    }
  };
  

  

// Delete comment by the owner
exports.deleteComment = async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).send({ error: 'Comment not found' });
  
      if (!comment.author || comment.author.toString() !== req.user.id) {
        return res.status(403).send({ error: 'Forbidden' });
      }
  
      await comment.deleteOne();
      res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
      errorHandler(err, req, res);
    }
  };
  

// Admin deletes any comment
exports.adminDeleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted by admin' });
    } catch (err) {
        errorHandler(err, req, res);
    }
};
