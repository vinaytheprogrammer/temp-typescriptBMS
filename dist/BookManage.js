export class BookManage {
    constructor() {
        this.books = [];
    }
    addBook(book) {
        if (this.books.some(b => b.isbn === book.isbn)) {
            console.error('ISBN already exists.');
            return;
        }
        this.books.push(book);
        console.log(`${book.title} has been added.`);
    }
    removeBook(isbn) {
        const index = this.books.findIndex(book => book.isbn === isbn);
        if (index === -1) {
            console.error('Book not found.');
            return;
        }
        this.books.splice(index, 1);
        console.log(`Book with ISBN ${isbn} has been removed.`);
    }
    getBooks() {
        return this.books;
    }
    findBook(isbn) {
        return this.books.find(book => book.isbn === isbn);
    }
}
