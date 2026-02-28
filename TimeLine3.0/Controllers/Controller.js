
/*const Data = [
    { name : "Michael Choi",
      createdAt : "23-01-2013",
      message : "This is my message. This is my message. This is my message. This is my message. This is my message."
    },
    { name : "Michael Choi",
      createdAt : "23-01-2013",
      message : "This is my message. This is my message. This is my message. This is my message. This is my message."
    },
    { name : "Michael Choi",
      createdAt : "23-01-2013",
      message : "This is my message. This is my message. This is my message. This is my message. This is my message."
    },
    { name : "Michael Choi",
      createdAt : "23-01-2013",
      message : "This is my message. This is my message. This is my message. This is my message. This is my message."
    }
]; */
const postmodels = require('../Model/Post');
const commentmodels = require('../Model/Comment');
const usermodels = require('../Model/User');

const Timehandler = (req, res) => {

    postmodels.find()
    .populate('user', 'name')
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
    })
    .sort({ createdAt: -1 })  
    .then(results => {

        const error = req.query.error;

        res.status(200).render('Timeline', {
            post: results,
            error
        });

    })
    .catch(err => {
        console.log(err);
    });

};

const Posthandler = (req, res) => {

    let name = req.body.name;
    let postText = req.body.post;

    usermodels.findOne({ name: name })
    .then((user) => {

        if (user) {
            return user;
        } else {
            let newUser = new usermodels({ name: name });
            return newUser.save();
        }

    })
    .then((userData) => {

        let nwpost = new postmodels({
            post: postText,
            user: userData._id
        });

        return nwpost.save();

    })
    .then(() => {
        res.redirect('/timeline');
    })
    .catch((error) => {

        postmodels.find()
        .then((results) => {
            res.render('Timeline', {
                post: results,
                error: error.errors?.post?.message
            });
        });

    });

};
const Deletehandler = (req, res) => {
    const postId = req.params.id;
    postmodels.findById(postId)
    .then(post => {
        if (!post) throw new Error('Post not found');
        return commentmodels.deleteMany({ _id: { $in: post.comments } });
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
    postmodels.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
    .then(() => {
        res.redirect('/timeline');
    })
    .catch((error) => {
        postmodels.findById(req.params.id).then((postinfo) => {
            res.render('editedpost', {
                post: postinfo,
                error: error.errors.post.message
            });
        });
    });
};
const Commenthandler = (req, res) => {

    let postId = req.params.postId;
    let name = req.body.name;
    let body = req.body.body;

    if (!body || body.trim().length < 25) {
        return res.redirect('/timeline?error=Comment should be minimum 25 characters');
    }

    usermodels.findOne({ name: name })
    .then((user) => {

        if (user) {
            return user;
        } else {
            let newUser = new usermodels({ name: name });
            return newUser.save();
        }

    })
    .then((userData) => {

        let nwcomment = new commentmodels({
            body: body,
            post: postId,
            user: userData._id
        });

        return nwcomment.save();

    })
    .then((savedComment) => {

        return postmodels.findById(postId)
        .then((postinfo) => {

            postinfo.comments.push(savedComment._id);
            return postinfo.save();

        });

    })
    .then(() => {
        res.redirect('/timeline');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/timeline');
    });

};
const DeleteComhandler = (req, res) => {
    let commentId = req.params.commentId;
    let postId = req.params.postId;

    commentmodels.findByIdAndDelete(commentId)
    .then(() => {
        postmodels.findById(postId)
        .then((postinfo) => {
            if (!postinfo) {
                throw new Error("Post not found");
            }

            postinfo.comments = postinfo.comments.filter(id => id.toString() !== commentId);

            postinfo.save()
            .then(() => {
                res.redirect('/timeline');
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/timeline');
            });

        })
        .catch((err) => {
            console.log(err);
            res.redirect('/timeline');
        });

    })
    .catch((err) => {
        console.log(err);
        res.redirect('/timeline');
    });
};
module.exports={
    Timehandler,
    Posthandler,
    Deletehandler,
    Updatehandler,
    editedPosthandler,
    Commenthandler,
    DeleteComhandler

};
