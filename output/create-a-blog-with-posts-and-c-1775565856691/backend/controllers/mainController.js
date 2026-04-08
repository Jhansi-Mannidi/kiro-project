const { Post } = require('../models');
const { Comment } = require('../models');

async function getPosts(req, res) {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching posts' });
  }
}

async function getPostById(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching post' });
  }
}

async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({ title, content });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating post' });
  }
}

async function updatePost(req, res) {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const updatedPost = await Post.update({ title, content }, { where: { id: postId } });
    if (!updatedPost[0]) {
      return res.status(404).send({ message: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating post' });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    await Post.destroy({ where: { id: postId } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting post' });
  }
}

async function getComments(req, res) {
  try {
    const postId = req.params.id;
    const comments = await Comment.findAll({ where: { postId } });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching comments' });
  }
}

async function createComment(req, res) {
  try {
    const { content } = req.body;
    const newComment = await Comment.create({ content, postId: req.params.id });
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating comment' });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.params.commentId;
    await Comment.destroy({ where: { id: commentId } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting comment' });
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  deleteComment
};