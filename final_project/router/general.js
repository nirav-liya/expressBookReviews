const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
 //res.send(JSON.stringify(books,null,4));
 
 //Promise callbacks
 let myPromise = new Promise((resolve,reject) => {
        resolve("Promise resolved")
    })

    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        res.send(JSON.stringify(books,null,4));
      })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
   // res.send(books[isbn])

   let myPromise = new Promise((resolve,reject) => {
    resolve("Promise resolved")
})

myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
    res.send(books[isbn])
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book;
    
    /*var keys = Object.keys(books);
    for (var i = 0; i < keys.length; i++) {
        if (books[keys[i]].author==author)
            book=books[keys[i]];
    }
    return res.send(book);*/

    let myPromise = new Promise((resolve,reject) => {
        var keys = Object.keys(books);
        for (var i = 0; i < keys.length; i++) {
            if (books[keys[i]].author==author)
                book=books[keys[i]];
        }
        resolve(book)
    })
    
    myPromise.then((book) => {
        res.send(book)
      })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book;
    /*var keys = Object.keys(books);
    for (var i = 0; i < keys.length; i++) {
        if (books[keys[i]].title==title)
            book=books[keys[i]];
    }
    return res.send(book);*/
    let myPromise = new Promise((resolve,reject) => {
        var keys = Object.keys(books);
        for (var i = 0; i < keys.length; i++) {
            if (books[keys[i]].title==title)
                book=books[keys[i]];
        }
        resolve(book)
    })
    
    myPromise.then((book) => {
        res.send(book)
      })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
