const { Post, Comment } = require('../models');
const { Op } = require('sequelize');

async function getPosts(req, res) {
  try {
    const posts = await Post.findAll({
      include: [{ model: Comment }]
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
}

async function getPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [{ model: Comment }]
    });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.json(post);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post' });
  }
}

async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await Post.update({ title, content }, { where: { id } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.json(post);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post' });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;
    await Post.destroy({ where: { id } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post' });
  }
}

async function getComments(req, res) {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: Post }]
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
}

async function createComment(req, res) {
  try {
    const { postId, content } = req.body;
    const comment = await Comment.create({ postId, content });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating comment' });
  }
}

async function updateComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await Comment.update({ content }, { where: { id } });
    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating comment' });
  }
}

async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    await Comment.destroy({ where: { id } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  updateComment,
  deleteComment
};