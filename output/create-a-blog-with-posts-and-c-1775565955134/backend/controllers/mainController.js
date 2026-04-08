const db = require('../models/index');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res) => {
  try {
    const posts = await db.Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const post = await db.Post.create(req.body);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.update(req.body);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await db.Post.destroy({ where: { id: postId } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await db.Comment.findAll({
      where: { postId: req.params.id },
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await db.Comment.create({ ...req.body, postId: req.params.id });
    res.json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await db.Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.update(req.body);
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await db.Comment.destroy({ where: { id: commentId } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};