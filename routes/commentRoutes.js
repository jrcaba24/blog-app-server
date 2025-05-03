const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verify, verifyAdmin } = require('../auth');

router.get('/post/:postId', commentController.getCommentsForPost);
router.post('/:postId', verify, commentController.addComment);
router.delete('/:id', verify, commentController.deleteComment);
router.delete('/:id/admin', verify, verifyAdmin, commentController.adminDeleteComment);

module.exports = router;
