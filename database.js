import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getBooks() {
    const [rows] = await pool.query("Select * from books")
    return rows
}

async function getBookById(id) {
    const [rows] = await  pool.query(`
        Select * 
        from books 
        where book_id = ?
        `, [id])
    return rows[0]
}

// const books = await getBooks()
// console.log(books)

// const bookById = await getBookById(2)
// console.log(bookById)

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}

// function getCurrentDate() {
//     const date = new Date();
//     date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
//     return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
// }

async function createBook(title, author_id, price, genre) {
    const published_date = getCurrentDate();
    const [resultCreate] = await pool.query(`
        INSERT INTO books (title, author_id, price, published_date, genre)
        VALUES (?, ?, ?, ?, ?)
    `, [title, author_id, price, published_date, genre]);
    const id = resultCreate.insertId
    return getBookById(id)
    // return resultCreate.insertId;
}

const resultCreate = await createBook('To Kill a Mockingbird', 1, 15.99, 'Southern Gothic')
console.log(resultCreate)
