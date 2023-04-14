const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);

app.route("/articles")
.get((req, res) =>{
    Article.find()
        .then((results)=>{
            res.send(results);
        })
        .catch((err)=>{
            res.send(err);
        })
})
.post((req, res)=>{
    const newEntry = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newEntry.save()
        .then(()=>{
            res.send("Successfully added new entry");
        })
        .catch((err)=>{
            res.send(err);
        });

})
.delete((req, res)=>{
    Article.deleteMany()
        .then(()=>{
            res.send("Successfully deleted all entries");
        })
        .catch((err)=>{
            res.send(err);
        })
});

app.route("/articles/:articleTitle")
.get((req, res)=>{
    Article.findOne({title: req.params.articleTitle})
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        })
})
.put((req, res)=>{
    Article.replaceOne({title: req.params.articleTitle}, req.body)
        .then(()=>{
            res.send("Success");
        })
        .catch((err)=>{
            res.send(err);
        });
})
.patch((req, res)=>{
    Article.updateOne({title: req.params.articleTitle}, req.body)
        .then(()=>{
            res.send("Success");
        })
        .catch((err)=>{
            res.send(err);
        });
})
.delete((req, res)=>{
    Article.deleteOne({title: req.params.articleTitle})
        .then(()=>{
            res.send("Successfully deleted the article");
        })
        .catch((err)=>{
            res.send(err);
        })
})

app.listen(3000, ()=>{
    console.log("Server listening on port 3000");
})