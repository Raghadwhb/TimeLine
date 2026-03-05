const Article = require('../Model/article');

const homehandler = (req,res)=>{

    Article.find().sort({_id:-1})

    .then((result)=>{
        res.render('homepage',{
            articles:result
        })
    })

    .catch((err)=>{
        console.log(err)
        res.send("Error loading homepage")
    })

}



const addNewArticle = (req,res)=>{

    res.render('addNewArticle',{
        errors:null,
        data:{}
    })

}



const submitArticle = (req,res)=>{

    const {title,article} = req.body

    const newArticle = new Article({
        title,
        article
    })

    newArticle.save()

    .then(()=>{
        res.redirect('/homepage')
    })

    .catch((err)=>{

        if(err.name === "ValidationError"){

            res.render('addNewArticle',{
                errors:err.errors,
                data:req.body
            })

        }else{

            console.log(err)
            res.send("Error saving article")

        }

    })

}



const viewArticle = (req,res)=>{

    const articleId = req.params.id

    Article.findById(articleId)

    .then((result)=>{

        res.render('viewArticle',{
            article:result
        })

    })

    .catch((err)=>{
        console.log(err)
        res.send("Error loading article")
    })

}



const deleteArticle = (req,res)=>{

    const articleId = req.params.id

    Article.findByIdAndDelete(articleId)

    .then(()=>{
        res.redirect('/homepage')
    })

    .catch((err)=>{
        console.log(err)
        res.send("Error deleting article")
    })

}



const editArticle = (req,res)=>{

    const articleId = req.params.id

    Article.findById(articleId)

    .then((result)=>{

        res.render('editArticle',{
            article:result,
            errors:null
        })

    })

    .catch((err)=>{
        console.log(err)
        res.send("Error loading edit page")
    })

}



const updateArticle = (req,res)=>{

    const articleId = req.params.id
    const {title,article} = req.body

    Article.findByIdAndUpdate(

        articleId,
        {title,article},
        {runValidators:true,new:true}

    )

    .then(()=>{
        res.redirect('/homepage')
    })

    .catch((err)=>{

        if(err.name === "ValidationError"){

            Article.findById(articleId)

            .then((result)=>{

                res.render('editArticle',{
                    article:result,
                    errors:err.errors
                })

            })

        }else{

            console.log(err)
            res.send("Error updating article")

        }

    })

}



module.exports = {

homehandler,
addNewArticle,
submitArticle,
viewArticle,
deleteArticle,
editArticle,
updateArticle

}