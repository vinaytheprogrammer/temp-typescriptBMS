var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Base } from './Book.js'; // Add `.js` extension after compiling to JS
import { BookUtilities } from './BookUtilities.js';
import { BookDOM } from './BookDOM.js';
export class BookManager {
    constructor() {
        this.apiUrl = './books.json';
        this.books = [];
        this.form = document.querySelector('#addBookForm');
        this.categorizedBookListDiv = document.getElementById('bookList1');
        this.initialize();
    }
    //this initialize method will help us to fetch the books from the API and after this display it on the screen
    // async and await will help us to wait for the fetchBooks method to complete and then display the books on the screen
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchBooks();
            this.bookDOM = new BookDOM(this.books); // has-a relationship with BookDOM
            this.bookDOM.updateBookDisplay();
            this.attachEventListeners();
        });
    }
    attachEventListeners() {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = document.getElementById('applyFilters')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.bookDOM.filterBooks());
        (_b = document.getElementById('resetFilters')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.bookDOM.resetFilters());
        (_c = this.form) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', (e) => this.addBook(e));
        (_d = document.querySelector('#editBookForm button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', this.handleEdit.bind(this)); // bind helps to access the this keyword    
        (_e = document.querySelector('#deleteBookForm button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
        (_f = document.querySelector('#categorizeBooksForm button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => this.bookDOM.handleCategorize(this.categorizedBookListDiv));
        (_g = document.getElementById('remove')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => this.bookDOM.removeCategorizedBooks(this.categorizedBookListDiv));
    }
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            BookUtilities.showLoader("Fetching books...");
            try {
                yield new Promise((resolve) => setTimeout(resolve, 1000));
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const booksObject = yield response.json();
                this.books = Object.values(booksObject).map((book) => new Base(book.title, book.author, book.genre, book.isbn, book.price, book.pubDate));
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
    addBook(event) {
        var _a, _b, _c, _d, _e, _f;
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
        if (this.books.some(book => book.isbn === isbn)) {
            toastr.error('ISBN already exists.');
            return;
        }
        const book = new Base(title, author, genre, isbn, price, pubDate);
        this.books.push(book);
        BookDOM.closeForm();
        toastr.success(`${title} has been added.`);
        // reset the Add form fields
        const elementIds = ['title', 'author', 'isbn', 'price', 'pub_date', 'genre'];
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        // Update the book display with the new book change
        this.bookDOM.updateBookDisplay(this.books);
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
        BookDOM.closeForm();
        toastr.success('Book updated successfully.');
        this.bookDOM.updateBookDisplay(this.books);
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
        BookDOM.closeForm();
        this.books.splice(bookIndex, 1); // Remove the book from the books array
        toastr.success('Book deleted successfully.');
        this.bookDOM.updateBookDisplay(this.books);
    }
}
