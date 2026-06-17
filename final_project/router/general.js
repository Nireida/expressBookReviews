const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        if (userswithsamename.length === 0) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: список всех книг через async-await + Promise
public_users.get('/', async function (req, res) {
    try {
        const getAllBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const allBooks = await getAllBooks;
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: детали книги по ISBN через async-await + Promise
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const getBookByISBN = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
        const book = await getBookByISBN;
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "no book" });
    }
});

// Task 12: детали книги по автору через async-await + Promise
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const result = Object.values(books).filter(el => el.author === author);
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found");
            }
        });
        const result = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "no book" });
    }
});

// Task 13: детали книги по названию через async-await + Promise
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBooksByTitle = new Promise((resolve, reject) => {
            const result = Object.values(books).filter(el => el.title === title);
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found");
            }
        });
        const result = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: "no book" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = isbn ? books[isbn] : null;
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "no book" });
    }
});

module.exports.general = public_users;
