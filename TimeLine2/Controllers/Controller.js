const postmodels = require('../Model/Post');
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

const Timehandler= (req,res)=>{
    postmodels.find()
    .then((results)=>{
        res.status(200).render('Timeline', {post: results})
    }).catch((err)=>{
        console.log(err);
    })
};

const Posthandler= (req,res)=>{
    let nwpost= new postmodels(req.body);
    nwpost.save()
    .then(()=>{
        res.redirect('/timeline');
    }).catch((error) => {
    postmodels.find().then((results) => {
        res.render('Timeline', {
            post: results,
            error: error.errors.post.message });
    });
});
}
const Deletehandler= (req,res)=>{
    console.log('Delete handler called');
    console.log(req.params.id);
    postmodels.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect('/timeline');
    }).catch((err)=>{
        console.log(err);
    })
}
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

module.exports={
    Timehandler,
    Posthandler,
    Deletehandler,
    Updatehandler,
    editedPosthandler
};