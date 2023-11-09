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
 
 let booksResponse = {"books":books};
 
 res.send(booksResponse);
 
 //Promise callbacks
 /*
 let myPromise = new Promise((resolve,reject) => {
    let booksResponse = {"books":books};
    resolve(booksResponse)
    })

    myPromise.then((booksResponse) => {
         res.send(booksResponse);
      })*/
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])

   /*
   let myPromise = new Promise((resolve,reject) => {
    resolve(books[isbn])
    })

    myPromise.then((book) => {
       res.send(book)
    })
    */
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksbyauther=[];

    var keys = Object.keys(books);
    for (var i = 0,j=0; i < keys.length; i++) {
        if (books[keys[i]].author==author) {
            booksbyauther[j++]={"isbn":keys[i],"title":books[keys[i]].title,"reviews":books[keys[i]].reviews};
        }
    }
    let bookResponse = {"booksbyauther":booksbyauther};
    return res.send(bookResponse);

   /* 
   let myPromise = new Promise((resolve,reject) => {
        var keys = Object.keys(books);
        for (var i = 0,j=0; i < keys.length; i++) {
            if (books[keys[i]].author==author) {
                booksbyauther[j++]={"isbn":keys[i],"title":books[keys[i]].title,"reviews":books[keys[i]].reviews};
            }
        }
        let bookResponse = {"booksbyauther":booksbyauther};
        resolve(bookResponse)
    })
    
    myPromise.then((bookResponse) => {
        res.send(bookResponse)
      })
      */
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksbytitle=[];

    var keys = Object.keys(books);
    for (var i = 0,j=0; i < keys.length; i++) {
        if (books[keys[i]].title==title) {
            booksbytitle[j++]={"isbn":keys[i],"author":books[keys[i]].author,"reviews":books[keys[i]].reviews};
        }
    }
    let bookResponse = {"booksbytitle":booksbytitle};
    return res.send(bookResponse);

    /*
    let myPromise = new Promise((resolve,reject) => {
       var keys = Object.keys(books);
        for (var i = 0,j=0; i < keys.length; i++) {
            if (books[keys[i]].title==title) {
                booksbytitle[j++]={"isbn":keys[i],"author":books[keys[i]].author,"reviews":books[keys[i]].reviews};
            }
        }
        let bookResponse = {"booksbytitle":booksbytitle};
        resolve(bookResponse)
    })
    
    myPromise.then((bookResponse) => {
        res.send(bookResponse)
      })
      */
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
