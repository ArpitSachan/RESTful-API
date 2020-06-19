const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app =express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema ={
  title : String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post( function(req, res){
  const newArticle= new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully POST");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Deleted");
    }else{
      res.send(err);
    }
  });
});

app.route("/articles/:customArticle")
.get(function(req, res){

  Article.findOne({title: req.params.customArticle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No match found!");
    }
  })
})
.put(function(req, res){
  Article.update(
    {title: req.params.customArticle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Updated!");
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.customArticle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully applied patch");
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne({title: req.params.customArticle},function(err){
    if(!err){
      res.send("succesfullt Deleted!");
    }
  })
})

app.listen(3000, function(){
  console.log("Server running..");
});
