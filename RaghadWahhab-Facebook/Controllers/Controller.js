const feed = require('../Models/Feed');
const mongoose = require('mongoose');

const homehandler = (req,res)=>{
    feed.find().sort({createdAt:-1})
    .then((result)=>{
        res.render('FacebookwelcomePage',{
            feed:result,
            errors:null,
            data:null
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send("Error loading feed");
    });
};

const addPostHandler = (req,res)=>{

    const {Name,Message} = req.body;

    const newFeed = new feed({
        Name,
        Message
    });

    newFeed.save()

    .then(()=>{
        res.redirect('/feed');
    })

    .catch((err)=>{

        if(err.name === "ValidationError"){

            feed.find().sort({createdAt:-1})

            .then((posts)=>{

                res.render('FacebookwelcomePage',{
                    feed:posts,
                    errors:err.errors,
                    data:req.body
                });

            });

        }else{

            console.log(err);
            res.send("Error saving post");

        }

    });

};

const detailedFeedHandler = (req,res)=>{

    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send("Invalid ID");
    }

    feed.findById(id)

    .then((data)=>{

        if(!data){
            return res.status(404).send("Post not found");
        }

        res.render('FacebookFeedDetail',{post:data});

    })

    .catch((err)=>{
        console.log(err);
        res.status(500).send("Error loading post");
    });

};

const deleteFeedHandler = (req,res)=>{

    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send("Invalid ID");
    }

    feed.findByIdAndDelete(id)

    .then(()=>{
        res.redirect('/feed');
    })

    .catch((err)=>{
        console.log(err);
        res.status(500).send("Error deleting post");
    });

};

const editFeedHandler = (req,res)=>{

    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send("Invalid ID");
    }

    feed.findById(id)

    .then((data)=>{

        if(!data){
            return res.status(404).send("Post not found");
        }

        res.render('FacebookFeedEdit',{
            post:data,
            errors:null
        });

    })

    .catch((err)=>{
        console.log(err);
        res.status(500).send("Error loading edit page");
    });

};

const updateFeedHandler = (req,res)=>{

    const id = req.params.id;

    const {Name,Message} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send("Invalid ID");
    }

    feed.findByIdAndUpdate(id,{Name,Message},{
        runValidators:true,
        new:true
    })

    .then((data)=>{

        if(!data){
            return res.status(404).send("Post not found");
        }

        res.redirect(`/feed/${id}`);

    })

    .catch((err)=>{

             if(err.name === "ValidationError"){

            res.render('FacebookFeedEdit',{
                post:{
                    _id:id,
                    Name:Name,
                    Message:Message
                },
                errors:err.errors
            });

        }else{

            console.log(err);
            res.send("Error updating post");

        }

    });

};

module.exports = {

    homehandler,
    addPostHandler,
    detailedFeedHandler,
    deleteFeedHandler,
    editFeedHandler,
    updateFeedHandler

};