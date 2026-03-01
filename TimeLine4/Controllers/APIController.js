const Post = require('../Model/Post');
const Comment = require('../Model/Comment');
const User = require('../Model/User');

const defaultUserName = "Client";


const getAllPosts = (req, res) => {
    Post.find()
    .populate('user', 'name')
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
    })
    .sort({ createdAt: -1 })
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};

const postOnePost = (req, res) => {
    const postText = req.body.post;

    if (!postText || postText.trim().length < 25) {
        return res.status(400).json({ message: "Post should be minimum 25 characters" });
    }

    User.findOne({ name: defaultUserName })
    .then(user => {
        if (user) return user;
        const newUser = new User({ name: defaultUserName });
        return newUser.save();
    })
    .then(userData => {
        const newPost = new Post({
            post: postText,
            user: userData._id
        });
        return newPost.save();
    })
    .then(savedPost => {
        res.status(201).json(savedPost);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};


const updateOnePost = (req, res) => {
    const postId = req.params.id;
    const postText = req.body.post;

    if (!postText || postText.trim().length < 25) {
        return res.status(400).json({ message: "Post should be minimum 25 characters" });
    }

    Post.findByIdAndUpdate(postId, { post: postText }, { new: true, runValidators: true })
    .then(updatedPost => {
        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updatedPost);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};


const deletePost = (req, res) => {
    const postId = req.params.id;

    Post.findById(postId)
    .then(post => {
        if (!post) return res.status(404).json({ message: "Post not found" });
        return Comment.deleteMany({ _id: { $in: post.comments } });
    })
    .then(() => {
        return Post.findByIdAndDelete(postId);
    })
    .then(() => {
        res.status(200).json({ message: "Post and its comments deleted successfully" });
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};


const getAllCommentsPost = (req, res) => {
    const postId = req.params['id_post'];

    Post.findById(postId)
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
    })
    .then(post => {
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post.comments);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
}; 

const postOneComment = (req, res) => {
    const postId = req.params['id_post'];
    const body = req.body.body;

    if (!body || body.trim().length < 25) {
        return res.status(400).json({ message: "Comment should be minimum 25 characters" });
    }

    User.findOne({ name: defaultUserName })
    .then(user => {
        if (user) return user;
        const newUser = new User({ name: defaultUserName });
        return newUser.save();
    })
    .then(userData => {
        const newComment = new Comment({
            body: body,
            post: postId,
            user: userData._id
        });
        return newComment.save();
    })
    .then(savedComment => {
        return Post.findById(postId)
        .then(post => {
            if (!post) throw new Error("Post not found");
            post.comments.push(savedComment._id);
            return post.save();
        })
        .then(() => {
            res.status(201).json({ message: "Comment added", comment: savedComment });
        });
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};

module.exports = {
    getAllPosts,
    postOnePost,
    updateOnePost,
    deletePost,
    getAllCommentsPost,
    postOneComment
};