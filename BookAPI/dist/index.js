"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Sample_data_js_1 = __importDefault(require("./data/Sample_data.js"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
//Get all books (in pages)
//Search books by year/author/title
app.get('/books', (req, res) => {
    var _a, _b;
    if (req.query.title !== undefined) {
        const title = req.query.title;
        const filteredBooks = Sample_data_js_1.default.filter(book => book.title === title);
        res.send(filteredBooks);
        return;
    }
    else if (req.query.year !== undefined) {
        const year = parseInt(req.query.year.toString());
        const filteredBooks = Sample_data_js_1.default.filter(book => book.publicationYear === year);
        res.send(filteredBooks);
        return;
    }
    else if (req.query.author !== undefined) {
        const author = req.query.author;
        const filteredBooks = Sample_data_js_1.default.filter(book => book.author === author);
        res.send(filteredBooks);
        return;
    }
    else {
        const page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
        const pageSize = parseInt(((_b = req.query.pageSize) === null || _b === void 0 ? void 0 : _b.toString()) || '10');
        const filteredItems = Sample_data_js_1.default.slice((page - 1) * pageSize, page * pageSize);
        res.send({
            page,
            pageSize,
            totalBooks: Sample_data_js_1.default.length,
            items: filteredItems
        });
    }
});
//Get specific book by id
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Sample_data_js_1.default.forEach(book => {
        if (book['id'] === id) {
            res.status(200).send(book);
            return;
        }
    });
    res.status(404).send("Book not found :(");
});
//Get specific book by id
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Sample_data_js_1.default.forEach(book => {
        if (book['id'] === id) {
            res.status(200).send(book);
            return;
        }
    });
    res.status(404).send("Book not found :(");
});
//Add new book
app.post('/books', (req, res) => {
    if (req.body.id !== undefined) {
        let found = Sample_data_js_1.default.findIndex((book) => book.id === req.body.id);
        if (found >= 0) {
            const newBook = {
                id: req.body.id,
                title: req.body.title,
                author: req.body.author,
                publicationYear: req.body.publicationYear
            };
            Sample_data_js_1.default.push(newBook);
            res.status(201).send("New book added successfuly!");
        }
        else
            res.send("Error: ID already exists!");
    }
    else
        res.send("Error: No id provided!");
});
//update specific book
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedBook = {
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear
    };
    for (let i = 0; i < Sample_data_js_1.default.length; i++) {
        if (Sample_data_js_1.default[i].id === id) {
            Sample_data_js_1.default[i] = Object.assign(Object.assign({}, Sample_data_js_1.default[i]), updatedBook);
            res.send("Success update book!");
            return;
        }
    }
    res.status(404).send("Book not found :(");
});
//Delete specific book
app.delete('/books/:id', (req, res) => {
    /*var _a;
    if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.id)) {
        res.send('Error: Please send student ID in query params!');
        return;
    }
    else {*/
    const id = parseInt(req.params.id);
    let found = Sample_data_js_1.default.findIndex((book) => book.id === id);
    if (found >= 0) {
        Sample_data_js_1.default.splice(found, 1);
        res.status(201).send("Successfully Deleted Book!");
        return;
    }
    else {
        res.status(404).send("Error: Book Not found!");
    }
});
app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});
