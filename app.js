//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "Welcome to My Daily Journal";
const aboutContent = "This is my Daily Journal website powered by MongoDB";
const contactContent = "Why do you event want to contact me. Hey!, this is my secret";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/JournalDB');

const postSchema={
  title: String,
  content: String
};

const Post = mongoose.model('Post', postSchema);
posts=[]


app.get("/", function(req, res){

  Post.find().then((data) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: data
      });
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");

});

app.get("/posts/:postId", async function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestPostId = req.params.postId;

  const post = await Post.findById(requestPostId);

  res.render("post", {
    title: post.title,
    content: post.content
  });

  
});

app.post('/delete-post/:postId', async (req, res) => {
  const postId = req.params.postId;

  // Find the post by its ID and delete it from the MongoDB collection
  await Post.findByIdAndRemove(postId);

  res.redirect("/");

  
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
