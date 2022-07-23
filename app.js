const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogDB")

const app = express();
app.locals._ = _;
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine',"ejs");
app.use(express.static('public'));

const homeContent = "Cras pellentesque eros eget libero euismod, at pulvinar sem vulputate. Curabitur sed finibus erat. Morbi fermentum at orci nec eleifend. Suspendisse potenti. Aliquam erat volutpat. Nulla lacinia vestibulum nisl sit amet blandit. Proin et ex ullamcorper, lacinia eros vitae, rutrum dolor. Nullam cursus purus at quam eleifend egestas. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris fermentum ultrices turpis eu hendrerit. Donec congue metus enim, id suscipit arcu auctor et. Nulla porttitor est purus, eu vehicula sapien finibus id. Vestibulum ac odio eu urna egestas sollicitudin. Nulla facilisi. Donec non eros non felis tristique laoreet a eu augue. Nullam et nulla a odio tempus malesuada blandit sit amet mauris.";
const aboutContent = "Yes";
const contactContent = "Proin facilisis dignissim felis ut euismod. Sed non elementum nibh. Morbi eu dignissim urna, in suscipit lorem. Donec dolor sem, imperdiet ac ipsum et, bibendum ullamcorper sem. Curabitur non ipsum vel eros malesuada porta sit amet eu ipsum. Morbi vehicula sit amet ante id egestas. Ut a aliquet nisi. Curabitur sodales, mi sed malesuada mollis, sapien mi sodales erat, vitae sodales arcu dui in elit. In ligula arcu, pellentesque id congue eget, sagittis et ex. Nulla semper eleifend nisi. Ut aliquam massa non leo rutrum porta. Etiam turpis ante, lacinia interdum nunc vel, finibus scelerisque dolor. Quisque lacinia, nisi vel vestibulum scelerisque, leo tortor fringilla nisl, pharetra egestas felis mi vel felis.";

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please provide a suitable title."],
        minLength: 3,
        maxLength: 50
    },
    text:{
        type:String,
        required:[true,"Post cannot be empty."],
        minLength: [10,"Why low on words? Words are free."],
        maxLength: [5000,"Woah there William."]
    }
});

const Post = mongoose.model("Post",postSchema);


app.get('/',function(req,res){
    Post.find({},function(err,result){
        if(!err){
            res.render('home',{content:homeContent,items:result});
        }
    });
});

app.post('/',function(req,res){
    Post.create({
        title:req.body.newContentTitle,
        text:req.body.newContentText
    },function(err){
        if(!err)
            console.log("Successfully added.");
            res.redirect('/');
    });

});


app.get('/about',function(req,res){
    res.render('about',{content:aboutContent});
});

app.get('/contact',function(req,res){
    res.render('contact',{content:contactContent});
});

app.get('/compose',function(req,res){
    res.render('compose');
});

app.get('/posts/:postid',function(req,res){
    const postID = req.params.postid;
    Post.findById(postID,"title text",function(err,result){
        if(!err&&result){
            res.render('post',{postTitle:result.title,postContent:result.text});
        }
        else
            res.render('error');
    });
});


app.listen(3000,function(){
    console.log("Started on localhost:3000");
})