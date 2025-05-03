const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verify, verifyAdmin } = require('../auth');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

router.post('/', verify, postController.createPost);
router.put('/:id', verify, postController.updatePost);
router.delete('/:id', verify, postController.deletePost);

// Admin override
router.delete('/:id/admin', verify, verifyAdmin, postController.adminDeletePost);

module.exports = router;
