const express = require('express');
const axios = require('axios');
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

// Вспомогательный маршрут — источник данных для Axios
public_users.get('/booksdata', function (req, res) {
    return res.status(200).json(books);
});

// Task 10: список всех книг через async-await + Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:8800/booksdata');
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 11: детали книги по ISBN через async-await + Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get('http://localhost:8800/booksdata');
        const book = response.data[isbn];
        if (book) {
            return res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            return res.status(404).json({ message: "no book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});

// Task 12: детали книги по автору через async-await + Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get('http://localhost:8800/booksdata');
        const book = Object.values(response.data).filter(el => el.author === author);
        if (book.length > 0) {
            return res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            return res.status(404).json({ message: "no book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});

// Task 13: детали книги по названию через async-await + Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get('http://localhost:8800/booksdata');
        const book = Object.values(response.data).filter(el => el.title === title);
        if (book.length > 0) {
            return res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            return res.status(404).json({ message: "no book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book", error: error.message });
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
