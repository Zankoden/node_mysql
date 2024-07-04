import express from "express";
import { getBooks, getBookById, createBook, deleteBookById, updateBookById } from "./database.js";

const app = express();

app.use(express.json());

app.get("/books", async (req, res) => {
    try {
        const books = await getBooks();
        res.status(200).send(books);
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).send("Error retrieving books");
    }
});

app.get("/books/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const bookByID = await getBookById(id);
        if (!bookByID) {
            return res.status(404).send(`Book with ID ${id} not found`);
        }
        res.status(200).send(bookByID);
    } catch (error) {
        console.error(`Error retrieving book with ID ${id}:`, error);
        res.status(500).send(`Error retrieving book with ID ${id}`);
    }
});

app.post("/createBook", async (req, res) => {
    const { title, author_id, price, genre } = req.body;
    if (!title || !author_id || !price || !genre) {
        return res.status(400).send("All fields (title, author_id, price, genre) are required");
    }
    try {
        const book = await createBook(title, author_id, price, genre);
        res.status(201).send(book);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).send("Error creating book");
    }
});

app.put("/updateBookById/:book_id", async (req, res) => {
    const book_id = req.params.book_id;
    const { title, price, genre } = req.body;
    
    if (!title && !price && !genre) {
        return res.status(400).send("No fields provided to update");
    }

    try {
        const result = await updateBookById(title, price, genre, book_id);
        res.status(200).send(result);
    } catch (error) {
        if (error.message.includes("not found")) {
            return res.status(404).send(`Book with ID ${book_id} not found`);
        }
        console.error(`Error updating book with ID ${book_id}:`, error);
        res.status(500).send(`Error updating book with ID ${book_id}`);
    }
});


app.delete("/deleteBookById/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deleteBook = await deleteBookById(id);
        if (!deleteBook.affectedRows) {
            return res.status(404).send(`Book with ID ${id} not found`);
        }
        res.status(200).send(`Book with ID ${id} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        res.status(500).send(`Error deleting book with ID ${id}`);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! 💩');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
