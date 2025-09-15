// CS-312 MiniProject-1
// Simple blog app with Node, Express, and EJS
// NOTE: posts are not saved after restart (no database)

const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true })); // to read form data
app.use(express.static(path.join(__dirname, "public"))); // serve css etc

// fake "database" (just an array in memory)
let posts = [
  {
    id: Date.now(),
    author: "Example",
    title: "First Post",
    content: "This is just a sample post.",
    date: new Date().toLocaleString()
  }
];

// homepage (shows posts + add form)
app.get("/", (req, res) => {
  res.render("index", { posts: posts });
});

// add new post
app.post("/add", (req, res) => {
  const { author, title, content } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    date: new Date().toLocaleString()
  };
  posts.unshift(newPost); // put newest first
  res.redirect("/");
});

// load edit form
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) {
    return res.redirect("/");
  }
  res.render("edit", { post: post });
});

// save edited post
app.post("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.author = req.body.author;
    post.title = req.body.title;
    post.content = req.body.content;
    post.date = new Date().toLocaleString() + " (edited)";
  }
  res.redirect("/");
});

// delete post
app.post("/delete/:id", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
