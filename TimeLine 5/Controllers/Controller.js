const postmodels = require('../Model/Post');
const commentmodels = require('../Model/Comment');

const Timehandler = (req, res) => {

    postmodels.find()
    .populate({
        path: 'user',
        select: 'firstName lastName'
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'firstName lastName'
        }
    })
    .sort({ createdAt: -1 })
    .then(results => {

        const error = req.query.error;

        res.status(200).render('timeline', {
            post: results,
            error,
            user: req.user || null
        });

    })
    .catch(err => {
        console.log(err);
        res.redirect('/timeline?error=Server error');
    });
};

const Posthandler = (req, res) => {

    let postText = req.body.post;

    if (!postText || postText.trim().length < 25) {

        return postmodels.find()
        .then(results => {
            res.render('timeline', {
                post: results,
                error: "Post should be minimum 25 characters",
                user: req.user
            });
        });
    }

    let nwpost = new postmodels({
        post: postText,
        user: req.user._id
    });

    nwpost.save()
    .then(() => {
        res.redirect('/timeline');
    })
    .catch(error => {

        postmodels.find()
        .then(results => {
            res.render('timeline', {
                post: results,
                error: error.errors?.post?.message,
                user: req.user
            });
        });

    });
};

const Deletehandler = (req, res) => {

    const postId = req.params.id;

    postmodels.findById(postId)
    .then(post => {

        if (!post) {
            throw new Error('Post not found');
        }

        return commentmodels.deleteMany({ post: postId });

    })
    .then(() => {

        return postmodels.findByIdAndDelete(postId);

    })
    .then(() => {

        res.redirect('/timeline');

    })
    .catch(err => {

        console.log(err);
        res.redirect('/timeline?error=' + encodeURIComponent(err.message));

    });
};

const Updatehandler = (req, res) => {

    postmodels.findById(req.params.id)
    .populate('user', 'firstName lastName')
    .then(postinfo => {

        if (!postinfo) {
            return res.status(404).send('Post not found');
        }

        res.render('editedpost', { post: postinfo });

    })
    .catch(err => {
        res.status(500).send('Server Error');
    });
};

const editedPosthandler = (req, res) => {

    postmodels.findByIdAndUpdate(
        req.params.id,
        { post: req.body.post },
        { runValidators: true }
    )
    .then(() => {

        res.redirect('/timeline');

    })
    .catch(error => {

        postmodels.findById(req.params.id)
        .then(postinfo => {

            res.render('editedpost', {
                post: postinfo,
                error: error.errors?.post?.message
            });

        });

    });
};

const Commenthandler = (req, res) => {

    let postId = req.params.postId;
    let body = req.body.body;

    if (!body || body.trim().length < 25) {
        return res.redirect('/timeline?error=Comment should be minimum 25 characters');
    }

    let nwcomment = new commentmodels({
        body: body,
        post: postId,
        user: req.user._id
    });

    nwcomment.save()
    .then(savedComment => {

        return postmodels.findById(postId)
        .then(postinfo => {

            if (!postinfo) {
                throw new Error("Post not found");
            }

            postinfo.comments.push(savedComment._id);
            return postinfo.save();

        });

    })
    .then(() => {
        res.redirect('/timeline');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/timeline?error=' + encodeURIComponent(err.message));
    });
};

const DeleteComhandler = (req, res) => {

    let commentId = req.params.commentId;
    let postId = req.params.postId;

    commentmodels.findByIdAndDelete(commentId)
    .then(() => {

        return postmodels.findById(postId);

    })
    .then(postinfo => {

        if (!postinfo) {
            throw new Error("Post not found");
        }

        postinfo.comments = postinfo.comments.filter(
            id => id.toString() !== commentId
        );

        return postinfo.save();

    })
    .then(() => {

        res.redirect('/timeline');

    })
    .catch(err => {

        console.log(err);
        res.redirect('/timeline?error=' + encodeURIComponent(err.message));

    });
};

module.exports = {
    Timehandler,
    Posthandler,
    Deletehandler,
    Updatehandler,
    editedPosthandler,
    Commenthandler,
    DeleteComhandler
};