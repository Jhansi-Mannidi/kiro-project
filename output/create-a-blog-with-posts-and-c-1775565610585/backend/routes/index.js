const express = require('express');
const router = express.Router();

const postRouter = require('./post');
const commentRouter = require('./comment');

router.use('/posts', postRouter);
router.use('/comments', commentRouter);

module.exports = router;