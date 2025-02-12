import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';
import { BookFormHandler } from './BookFormHandler.js';
export class BookManagerG {
    constructor(books, bookDOMe) {
        this.books = [];
        this.books = books;
        this.bookDOMe = bookDOMe;
        this.form = document.querySelector('#addBookForm');
        this.categorizedBookListDiv = document.getElementById('bookList1');
    }
    attachEventListeners() {
        var _a, _b, _c, _d;
        if (this.form) {
            (_a = document.getElementById('applyFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.bookDOMe.filterBooks());
            (_b = document.getElementById('resetFilters')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.bookDOMe.resetFilters());
            // this.form.addEventListener('submit', (event) => this.addBook(event));
            (_c = document
                .querySelector('#categorizeBooksForm button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
            (_d = document
                .getElementById('remove')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
        }
    }
    addBook(event) {
        event.preventDefault();
        const formData = BookFormHandler.getFormValues(['bookType', 'title', 'author', 'isbn', 'price', 'pub_date', 'genre']);
        if (!BookUtilities.isValidInput(formData.title, formData.author, formData.isbn, formData.price, formData.pub_date) ||
            BookUtilities.isbnExists(this.books, formData.isbn)) {
            return;
        }
        let book;
        if (formData.bookType === 'ebook') {
            const fileSize = Number(BookUtilities.getInputValue('fileSize'));
            const format = BookUtilities.getInputValue('fileFormat');
            book = new EBook(formData.title, formData.author, formData.genre, formData.isbn, formData.price, formData.pub_date, fileSize, format);
        }
        else if (formData.bookType === 'printed') {
            const pages = Number(BookUtilities.getInputValue('pageCount'));
            book = new PrintedBook(formData.title, formData.author, formData.genre, formData.isbn, formData.price, formData.pub_date, pages);
        }
        else {
            // toastr.error('Invalid book type.');
            return;
        }
        this.books.push(book);
        toastr.success(`${formData.title} has been added.`);
        BookUtilities.resetForm(['bookType', 'title', 'author', 'isbn', 'price', 'pub_date', 'genre', 'fileSize', 'fileFormat', 'pageCount']);
        BookDOMe.closeForm();
        console.log('asdfghjhgfdsasdf', this.books);
        this.bookDOMe.updateBookDisplay(this.books);
    }
    // Handle Edit functionality
    handleEdit() {
        const formData = BookFormHandler.getFormValues(['editIsbn', 'newTitle', 'newAuthor', 'newPubDate', 'newGenre', 'newPrice', 'newFileSize', 'newFileFormat', 'newPages']);
        const isbn = Number(formData.editIsbn);
        const bookIndex = BookUtilities.findBookByIsbn(this.books, isbn);
        if (!BookUtilities.isValidInput(formData.newTitle, formData.newAuthor, isbn, formData.newPrice, formData.newPubDate)) {
            return;
        }
        // Update the book's details
        if (formData.newTitle)
            this.books[bookIndex].title = formData.newTitle;
        if (formData.newAuthor)
            this.books[bookIndex].author = formData.newAuthor;
        if (formData.newPubDate)
            this.books[bookIndex].pubDate = formData.newPubDate;
        if (formData.newGenre)
            this.books[bookIndex].genre = formData.newGenre;
        if (formData.newPrice)
            this.books[bookIndex].price = formData.newPrice;
        if (formData.bookType === 'ebook') {
            if (formData.newFileSize)
                this.books[bookIndex].fileSize = Number(formData.newFileSize);
            if (formData.newFileFormat)
                this.books[bookIndex].format = formData.newFileFormat;
        }
        else if (formData.bookType === 'printed') {
            if (formData.newPages)
                this.books[bookIndex].pages = Number(formData.newPages);
        }
        BookDOMe.closeForm();
        toastr.success('Book updated successfully.');
        BookUtilities.resetForm(['newTitle', 'newAuthor', 'editIsbn', 'newPrice', 'newPubDate', 'newGenre']);
        this.bookDOMe.updateBookDisplay(this.books);
    }
    // Handle Delete functionality
    handleDelete() {
        const isbn = Number(BookUtilities.getInputValue('deleteIsbn'));
        if (BookUtilities.validateIsbn(isbn) === -1)
            return;
        const bookIndex = BookUtilities.findBookByIsbn(this.books, Number(isbn));
        if (bookIndex === -1) {
            return; // Book not found, already handled inside the method
        }
        BookDOMe.closeForm();
        this.books.splice(bookIndex, 1); // Remove the book from the books array
        toastr.success('Book deleted successfully.');
        BookUtilities.resetForm(['deleteIsbn', 'deleteBType']);
        this.bookDOMe.updateBookDisplay(this.books);
    }
    getBooks() {
        return this.books;
    }
}
