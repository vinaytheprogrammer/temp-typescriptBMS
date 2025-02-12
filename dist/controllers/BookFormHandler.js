import { BookUtilities } from './BookUtilities.js';
import { EBook } from '../modals/EBook.js';
import { PrintedBook } from '../modals/PrintedBook.js';
export class BookFormHandler {
    static getFormValues(fieldIds) {
        const formData = {};
        fieldIds.forEach((id) => {
            const value = BookUtilities.getInputValue(id);
            formData[id] = isNaN(Number(value)) || value === '' ? value : Number(value);
        });
        return formData;
    }
    static createBookInstance(book) {
        switch (book.bookType) {
            case "ebook":
                return new EBook(book.title, book.author, book.genre, book.isbn, book.price, book.pubDate, book.fileSize, book.format);
            case "printed":
                return new PrintedBook(book.title, book.author, book.genre, book.isbn, book.price, book.pubDate, book.pages);
            default:
                throw new Error(`Unknown book type: ${book.bookType}`);
        }
    }
}
