const Post = require('../Model/post');
const Comment = require('../Model/comment');

// ===================== GET TIMELINE =====================
const getTimeline = (req, res) => {
    Post.find()
    .populate({ path: 'user', select: 'firstName lastName' })
    .populate({ path: 'comments', populate: { path: 'user', select: 'firstName lastName' } })
    .sort({ createdAt: -1 })
    .then(posts => res.json({ success: true, posts, user: req.user || null }))
    .catch(err => res.status(500).json({ success: false, error: 'Server error' }));
};

// ===================== CREATE POST =====================
const addPost = (req, res) => {
    const postText = req.body.post;
    if (!postText || postText.trim().length < 25) {
        return res.status(400).json({ success: false, error: "Post should be minimum 25 characters" });
    }

    const newPost = new Post({ post: postText, user: req.user._id });
    newPost.save()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ success: false, error: err.errors?.post?.message || 'Error saving post' }));
};

// ===================== DELETE POST =====================
const deletePost = (req, res) => {
    const postId = req.params.id;
    Post.findById(postId)
    .then(post => {
        if (!post) throw new Error('Post not found');
        return Comment.deleteMany({ post: postId }).then(() => Post.findByIdAndDelete(postId));
    })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ success: false, error: err.message }));
};

// ===================== EDIT POST =====================
const editPost = (req, res) => {
    const newText = req.body.post;
    if (!newText || newText.trim().length < 25) {
        return res.status(400).json({ success: false, error: "Post should be minimum 25 characters" });
    }

    Post.findByIdAndUpdate(req.params.id, { post: newText }, { runValidators: true })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ success: false, error: err.errors?.post?.message || err.message }));
};

// ===================== CREATE COMMENT =====================
const addComment = (req, res) => {
    const { postId } = req.params;
    const { body } = req.body;

    if (!body || body.trim().length < 25) {
        return res.status(400).json({ success: false, error: "Comment should be minimum 25 characters" });
    }

    const newComment = new Comment({ body, post: postId, user: req.user._id });

    newComment.save()
    .then(savedComment => Post.findById(postId).then(post => {
        if (!post) throw new Error("Post not found");
        post.comments.push(savedComment._id);
        return post.save();
    }))
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ success: false, error: err.message }));
};

// ===================== DELETE COMMENT =====================
const deleteComment = (req, res) => {
    const { commentId, postId } = req.params;

    Comment.findByIdAndDelete(commentId)
    .then(() => Post.findById(postId))
    .then(post => {
        if (!post) throw new Error("Post not found");
        post.comments = post.comments.filter(id => id.toString() !== commentId);
        return post.save();
    })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ success: false, error: err.message }));
};

module.exports = { getTimeline, addPost, deletePost, editPost, addComment, deleteComment };