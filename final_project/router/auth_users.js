const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
 let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password,
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let userLoggedin = req.user.username;
   
    let updatedReview = req.query.review;
    
    const isbn = req.params.isbn;
    let book = books[isbn]
    let reviews = book.reviews;

    for (var key in reviews)
    {
        if (key == userLoggedin)
        {
            reviews[userLoggedin].review = updatedReview;
            books[isbn].reviews = reviews;
            console.log(reviews);
            //return res.send(books);        
            return res.status(200).send(`Review for the book ISBN ${isbn} has been added/updated.`);
        }
    }
    reviews[userLoggedin] = {"review":updatedReview};
    books[isbn].reviews = reviews;
    //return res.send(books);
    return res.status(200).send(`Review for the book ISBN ${isbn} has been added/updated.`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let userLoggedin = req.user.username;
    const isbn = req.params.isbn;
    let book = books[isbn]
    let reviews = book.reviews;

    if (isbn){
        delete reviews[userLoggedin]
        books[isbn].reviews = reviews;
        return res.status(200).send(`Review for the ISBN ${isbn} posted by the user ${userLoggedin} deleted.`);
    }
    return res.send(`Book not found with ISBN : ${isbn}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
