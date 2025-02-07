var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';
import { PrintedBook } from '../modals/PrintedBook.js'; // Assuming Base is your book class (e.g., PrintedBook or EBook)
export class BookManage {
    constructor() {
        this.apiUrl = './books.json';
        this.books = [];
        this.form = document.querySelector('#addBookForm');
        this.categorizedBookListDiv = document.getElementById('bookList1');
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchBooks();
            this.bookDOMe = new BookDOMe(this.books);
            this.bookDOMe.updateBookDisplay();
            this.attachEventListeners();
        });
    }
    attachEventListeners() {
        var _a, _b, _c, _d, _e, _f;
        if (this.form) {
            (_a = document.getElementById('applyFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.bookDOMe.filterBooks());
            (_b = document.getElementById('resetFilters')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.bookDOMe.resetFilters());
            this.form.addEventListener('submit', (event) => this.addBook(event));
            (_c = document.querySelector('#categorizeBooksForm button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
            (_d = document.getElementById('remove')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
            (_e = document.querySelector('#editBookForm button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', this.handleEdit.bind(this)); // bind helps to access the this keyword    
            (_f = document.querySelector('#deleteBookForm button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
        }
    }
    addBook(event) {
        var _a, _b, _c, _d, _e, _f, _g;
        event.preventDefault();
        const title = (_a = document.getElementById('title')) === null || _a === void 0 ? void 0 : _a.value.trim();
        const author = (_b = document.getElementById('author')) === null || _b === void 0 ? void 0 : _b.value.trim();
        const isbn = Number((_c = document.getElementById('isbn')) === null || _c === void 0 ? void 0 : _c.value.trim());
        const price = Number((_d = document.getElementById('price')) === null || _d === void 0 ? void 0 : _d.value.trim());
        const pubDate = (_e = document.getElementById('pub_date')) === null || _e === void 0 ? void 0 : _e.value;
        const genre = (_f = document.getElementById('genre')) === null || _f === void 0 ? void 0 : _f.value;
        // Validate the input fields
        if (BookUtilities.validateTitle(title) === 'Special Characters not allowed')
            return;
        if (BookUtilities.validateAuthor(author) === 'Special Characters not allowed')
            return;
        if (BookUtilities.validateIsbn(isbn) === -1)
            return;
        if (BookUtilities.validatePrice(price) === -1)
            return;
        if (BookUtilities.validatePublicationDate(pubDate) === 'Invalid publication date')
            return;
        //'pages' still not added in html
        const pages = Number((_g = document.getElementById('pages')) === null || _g === void 0 ? void 0 : _g.value.trim());
        if (this.books.some(book => book.isbn === isbn)) {
            toastr.error('ISBN already exists.');
            return;
        }
        // Create a new book instance (modify this if you have different book types)
        const book = new PrintedBook(title, author, genre, isbn, price, pubDate, pages);
        this.books.push(book);
        // Close the form (assuming BookDOMe has a closeForm method)
        BookDOMe.closeForm(); // Replace with your actual form-close logic
        toastr.success(`${title} has been added.`);
        // Reset the Add form fields
        const elementIds = ['title', 'author', 'isbn', 'price', 'pub_date', 'genre'];
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        // Update the book display with the new book
        this.bookDOMe.updateBookDisplay(this.books);
    }
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            BookUtilities.showLoader('Fetching books...');
            try {
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const booksObject = yield response.json();
                this.books = Object.values(booksObject).map((book) => this.createBookInstance(book));
                toastr.success('Books fetched successfully');
            }
            catch (error) {
                toastr.error(`Error fetching books: ${error}`);
            }
            finally {
                BookUtilities.hideLoader();
            }
        });
    }
    createBookInstance(book) {
        // Customize this method to return the correct instance type (EBook, PrintedBook, etc.)
        return book;
    }
    // Handle Edit functionality
    handleEdit() {
        var _a, _b, _c, _d, _e, _f;
        const isbn = Number((_a = document.getElementById('editIsbn')) === null || _a === void 0 ? void 0 : _a.value.trim());
        const newTitle = (_b = document.getElementById('newTitle')) === null || _b === void 0 ? void 0 : _b.value.trim();
        const newAuthor = (_c = document.getElementById('newAuthor')) === null || _c === void 0 ? void 0 : _c.value.trim();
        const newPubDate = (_d = document.getElementById('newPubDate')) === null || _d === void 0 ? void 0 : _d.value;
        const newGenre = (_e = document.getElementById('newGenre')) === null || _e === void 0 ? void 0 : _e.value;
        const newPrice = (_f = document.getElementById('newPrice')) === null || _f === void 0 ? void 0 : _f.value;
        // Validate the input fields
        if (BookUtilities.validateIsbn(isbn) === -1)
            return;
        if (BookUtilities.validatePrice(Number(newPrice)) === -1)
            return;
        if (BookUtilities.validateTitle(newTitle) === 'Special Characters not allowed')
            return;
        if (BookUtilities.validateAuthor(newAuthor) === 'Special Characters not allowed')
            return;
        if (BookUtilities.validatePublicationDate(newPubDate) === 'Invalid publication date')
            return;
        // Find the book to edit
        const bookIndex = this.books.findIndex((book) => book.isbn == Number(isbn));
        if (bookIndex === -1) {
            toastr.error('Book not found.');
            return;
        }
        // Update the book's details
        if (newTitle)
            this.books[bookIndex].title = newTitle;
        if (newAuthor)
            this.books[bookIndex].author = newAuthor;
        if (newPubDate)
            this.books[bookIndex].pubDate = newPubDate;
        if (newGenre)
            this.books[bookIndex].genre = newGenre;
        if (newPrice)
            this.books[bookIndex].price = Number(newPrice);
        BookDOMe.closeForm();
        toastr.success('Book updated successfully.');
        this.bookDOMe.updateBookDisplay(this.books);
    }
    // Handle Delete functionality
    handleDelete() {
        var _a;
        const isbn = Number((_a = document.getElementById('deleteIsbn')) === null || _a === void 0 ? void 0 : _a.value.trim());
        if (BookUtilities.validateIsbn(isbn) === -1)
            return;
        // Find the index of the book to delete
        const bookIndex = this.books.findIndex((book) => book.isbn == Number(isbn));
        if (bookIndex === -1) {
            toastr.error('Book not found.');
            return;
        }
        BookDOMe.closeForm();
        this.books.splice(bookIndex, 1); // Remove the book from the books array
        toastr.success('Book deleted successfully.');
        this.bookDOMe.updateBookDisplay(this.books);
    }
}
