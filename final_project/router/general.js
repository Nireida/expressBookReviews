const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        if (userswithsamename.length === 0) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };

        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "no book" });
  }
 });

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (author) {
    const book = Object.values(books).filter(el => el.author === author);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "no book" });
  }
});

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if (title) {
      const book = Object.values(books).filter(el => el.title === title);
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({ message: "no book" });
    }
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = isbn ? books[isbn] : null;
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
      } else {
        return res.status(404).json({ message: "no book" });
      }
});

module.exports.general = public_users;
