import express from "express"
import { getBooks, getBookById, createBook, deleteBookById, updateBookById} from "./database.js"

const app = express()

app.use(express.json())

app.get("/books", async (req, res) => {
    const books = await getBooks()
    res.send(books)
})
app.get("/books/:id", async (req, res) => {
    const id = req.params.id
    const bookByID = await getBookById(id)
    res.send(bookByID)
})
app.post("/createBook", async (req, res) =>{
    const {title, author_id, price, genre} = req.body
    const book = await createBook(title, author_id, price, genre)
    res.status(201).send(book)

})
app.delete("/deleteBookById/:id", async (req, res) =>{
    const id = req.params.id
    const deleteBook = await deleteBookById(id)
    res.status(201).send("Deleted successfully")
})
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
        console.error(error);
        res.status(500).send(`Error updating book with ID ${book_id}`);
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke! 💩')
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})