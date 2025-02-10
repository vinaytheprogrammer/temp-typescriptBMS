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
export class BookManage {
    constructor() {
        // T extends IBook means T can be any type that extends IBook
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
            (_c = document
                .querySelector('#categorizeBooksForm button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
            (_d = document
                .getElementById('remove')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
            (_e = document.querySelector('#editBookForm button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', this.handleEdit.bind(this)); // bind helps to access the this keyword
            (_f = document.querySelector('#deleteBookForm button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
        }
    }
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            BookUtilities.showLoader('Fetching books...');
            try {
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const booksObject = yield response.json(); //
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
    addBook(event) {
        event.preventDefault(); // Prevent the default form submission
        const title = BookUtilities.getInputValue('title');
        const author = BookUtilities.getInputValue('author');
        const isbn = Number(BookUtilities.getInputValue('isbn'));
        const price = Number(BookUtilities.getInputValue('price'));
        const pubDate = BookUtilities.getInputValue('pub_date');
        const genre = BookUtilities.getInputValue('genre');
        const pages = Number(BookUtilities.getInputValue('pages')); // Optional if needed for PrintedBook
        // Validate the input
        if (!BookUtilities.isValidInput(title, author, isbn, price, pubDate) ||
            BookDOMe.isbnExists(this.books, isbn)) {
            return;
        }
        // Create a new book instance based on a condition (e.g., genre/type)
        const book = this.createBookInstance({
            title,
            author,
            genre,
            isbn,
            price,
            pubDate
        });
        this.books.push(book);
        toastr.success(`${title} has been added.`);
        // Reset form fields
        BookUtilities.resetForm(['title', 'author', 'isbn', 'price', 'pub_date', 'genre', 'pages']);
        BookDOMe.closeForm();
        // Update the book display
        this.bookDOMe.updateBookDisplay(this.books);
    }
    // Handle Edit functionality
    handleEdit() {
        const isbn = Number(BookUtilities.getInputValue('editIsbn'));
        const newTitle = BookUtilities.getInputValue('newTitle');
        const newAuthor = BookUtilities.getInputValue('newAuthor');
        const newPubDate = BookUtilities.getInputValue('newPubDate');
        const newGenre = BookUtilities.getInputValue('newGenre');
        const newPrice = Number(BookUtilities.getInputValue('newPrice'));
        const bookIndex = BookDOMe.findBookByIsbn(this.books, Number(isbn));
        if (bookIndex === -1) {
            return; // Book not found, already handled inside the method
        }
        //Validate the input
        if (!BookUtilities.isValidInput(newTitle, newAuthor, isbn, newPrice, newPubDate) ||
            BookDOMe.isbnExists(this.books, isbn)) {
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
        // Reset form fields
        BookUtilities.resetForm([
            'newTitle',
            'newAuthor',
            'editIsbn',
            'newPrice',
            'newPubDate',
            'newGenre',
            'pages'
        ]);
        this.bookDOMe.updateBookDisplay(this.books);
    }
    // Handle Delete functionality
    handleDelete() {
        const isbn = Number(BookUtilities.getInputValue('deleteIsbn'));
        if (BookUtilities.validateIsbn(isbn) === -1)
            return;
        const bookIndex = BookDOMe.findBookByIsbn(this.books, Number(isbn));
        if (bookIndex === -1) {
            return; // Book not found, already handled inside the method
        }
        BookDOMe.closeForm();
        this.books.splice(bookIndex, 1); // Remove the book from the books array
        toastr.success('Book deleted successfully.');
        BookUtilities.resetForm(['deleteIsbn']);
        this.bookDOMe.updateBookDisplay(this.books);
    }
}
