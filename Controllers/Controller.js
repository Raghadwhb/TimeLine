const Data = [
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
];

const Timehandler= (req,res)=>{
    res.status(200).render('Timeline', {post: Data})
};
module.exports={Timehandler};