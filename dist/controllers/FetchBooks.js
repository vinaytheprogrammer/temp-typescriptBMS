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
import { BookFormHandler } from './BookFormHandler.js';
export class FetchBooks {
    constructor() {
        this.apiUrl = './books.json';
        this.ebooks = [];
        this.printedBooks = [];
        this.allBooks = [];
        this.categorizedBookListDiv = document.getElementById('bookList1');
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.fetchBooks();
            // Create separate DOM handlers for EBooks and PrintedBooks
            this.ebookDOMe = new BookDOMe(this.ebooks);
            this.printedBookDOMe = new BookDOMe(this.printedBooks);
            (_a = document
                .querySelector('#categorizeBooksForm button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.allbookDOMe.handleCategorize(this.categorizedBookListDiv));
            (_b = document
                .getElementById('remove')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.allbookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
        });
    }
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            BookUtilities.showLoader('Fetching books...');
            try {
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const booksArray = yield response.json();
                // Separate books based on their type
                booksArray.forEach((book) => {
                    if (book.bookType === 'ebook') {
                        this.ebooks.push(BookFormHandler.createBookInstance(book));
                    }
                    else if (book.bookType === 'printed') {
                        this.printedBooks.push(BookFormHandler.createBookInstance(book));
                    }
                });
                // Combine both ebooks and printedBooks into a single array
                this.allBooks = [...this.ebooks, ...this.printedBooks];
                this.allbookDOMe = new BookDOMe(this.allBooks);
                this.allbookDOMe.updateBookDisplay(this.allBooks, 1, 'allBooks');
                // Update the book displays after fetching and categorizing the books
                console.log(this.ebooks, this.printedBooks);
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
    getEBooks() {
        return this.ebooks;
    }
    getPrintedBooks() {
        return this.printedBooks;
    }
    getEBookDOMe() {
        return this.ebookDOMe;
    }
    getPrintedBookDOMe() {
        return this.printedBookDOMe;
    }
    getAllBooks() {
        return this.allBooks;
    }
    getAllBookDOMe() {
        return this.allbookDOMe;
    }
}
