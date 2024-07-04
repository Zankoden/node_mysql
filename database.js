import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getBooks() {
    const [rows] = await pool.query("Select * from books")
    return rows
}

export async function getBookById(id) {
    const [rows] = await pool.query(`
        Select * 
        from books 
        where book_id = ?
        `, [id])
    return rows[0]
}

function getCurrentDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
}

export async function createBook(title, author_id, price, genre) {
    const published_date = getCurrentDate();
    const [resultCreate] = await pool.query(`
        INSERT INTO books (title, author_id, price, published_date, genre)
        VALUES (?, ?, ?, ?, ?)
    `, [title, author_id, price, published_date, genre]);
    const id = resultCreate.insertId
    return getBookById(id)

}

export async function updateBookById(title, price, genre, book_id) {
    const [resultUpdate] = await pool.query(`
        UPDATE books
        Set title = ?, price = ?, genre = ?
        where book_id =?
    `, [title, price, genre, book_id]);
    if (resultUpdate.affectedRows > 0) {
        return { message: `Book with ID ${book_id} updated successfully` };
    } else {
        throw new Error(`Book with ID ${book_id} not found`);
    }

}

export async function deleteBookById(id){
    const resultDelete = await pool.query(`
        Delete from books 
        where book_id = ?
        `, [id])
        return resultDelete
}



