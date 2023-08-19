import express from 'express';
import data from './data/Sample_data.js';

const app = express();
const port: number = Number(process.env.PORT) || 3000;
app.use(express.json());

//Get all books (in pages)
//Search books by year/author/title
app.get('/books', (req, res) => {

        if (req.query.title !== undefined) {
            const title = req.query.title;
            const filteredBooks = data.filter(book => book.title === title);
            res.send(filteredBooks);
            return;
        }
        else if(req.query.year !== undefined){
            const year = parseInt(req.query.year.toString());
            const filteredBooks = data.filter(book => book.publicationYear === year);
            res.send(filteredBooks);
            return;
        } 
        else if(req.query.author !== undefined){
            const author = req.query.author;
            const filteredBooks = data.filter(book => book.author === author);
            res.send(filteredBooks);
            return;
        } 
        else {
            const page = parseInt(req.query.page?.toString()|| '1');
            const pageSize = parseInt(req.query.pageSize?.toString() || '10');
            const filteredItems = data.slice((page - 1) * pageSize, page * pageSize);
            res.send({
                page,
                pageSize,
                totalBooks: data.length,
                items: filteredItems
            });
        }

    
});

//Health Check
app.get("/health", function (req, res) {
	res.sendStatus(200);
})


//Get specific book by id
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data.forEach(book => {
        if(book['id'] === id){
            res.status(200).send(book);
            return;
        }
    });
    res.status(404).send("Book not found :(");
});

//Get specific book by id
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data.forEach(book => {
        if(book['id'] === id){
            res.status(200).send(book);
            return;
        }
    });
    res.status(404).send("Book not found :(");
});

//Add new book
app.post('/books', (req, res) => {
    if(req.body.id !== undefined){
    let found = data.findIndex((book) => book.id === req.body.id);
    if(found >= 0){
    const newBook = {
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear
    };  
    data.push(newBook);
    res.status(201).send("New book added successfuly!");}
    else res.send("Error: ID already exists!");
}
    else res.send("Error: No id provided!");
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

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data[i] = { ...data[i], ...updatedBook };
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
        
        let found = data.findIndex((book) => book.id === id);
        if (found >= 0) {
            data.splice(found, 1);
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
