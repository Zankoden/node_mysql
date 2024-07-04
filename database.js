import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getBooks() {
    try {
        const [rows] = await pool.query("SELECT * FROM books");
        return rows;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books");
    }
}

export async function getBookById(id) {
    try {
        const [rows] = await pool.query("SELECT * FROM books WHERE book_id = ?", [id]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error(`Book with ID ${id} not found`);
        }
    } catch (error) {
        console.error(`Error fetching book with ID ${id}:`, error);
        throw new Error(`Failed to fetch book with ID ${id}`);
    }
}

function getCurrentDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
}

export async function createBook(title, author_id, price, genre) {
    try {
        const published_date = getCurrentDate();
        const [resultCreate] = await pool.query(`
            INSERT INTO books (title, author_id, price, published_date, genre)
            VALUES (?, ?, ?, ?, ?)
        `, [title, author_id, price, published_date, genre]);
        
        const id = resultCreate.insertId;
        return getBookById(id);
    } catch (error) {
        console.error("Error creating book:", error);
        throw new Error("Failed to create book");
    }
}

export async function updateBookById(title, price, genre, book_id) {
    try {
        const [resultUpdate] = await pool.query(`
            UPDATE books
            SET title = ?, price = ?, genre = ?
            WHERE book_id = ?
        `, [title, price, genre, book_id]);
        
        if (resultUpdate.affectedRows > 0) {
            return { message: `Book with ID ${book_id} updated successfully` };
        } else {
            throw new Error(`Book with ID ${book_id} not found`); // Throw an error if book is not found
        }
    } catch (error) {
        console.error(`Error updating book with ID ${book_id}:`, error);
        throw new Error(`Failed to update book with ID ${book_id}`);
    }
}


export async function deleteBookById(id) {
    try {
        const resultDelete = await pool.query("DELETE FROM books WHERE book_id = ?", [id]);
        return resultDelete[0]; // Return the result object directly
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        throw new Error(`Failed to delete book with ID ${id}`);
    }
}
