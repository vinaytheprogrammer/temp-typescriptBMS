import { BookManagerG } from './BookManagerG.js';
export class PrintedBookManager extends BookManagerG {
    constructor(books, bookDOMe) {
        super(books, bookDOMe);
        this.books = books;
        this.bookDOMe = bookDOMe;
        this.attachEventListeners();
    }
}
